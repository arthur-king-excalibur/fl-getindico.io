# -*- coding: utf-8 -*-
##
##
## This file is part of Indico.
## Copyright (C) 2002 - 2013 European Organization for Nuclear Research (CERN).
##
## Indico is free software; you can redistribute it and/or
## modify it under the terms of the GNU General Public License as
## published by the Free Software Foundation; either version 3 of the
## License, or (at your option) any later version.
##
## Indico is distributed in the hope that it will be useful, but
## WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
## General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with Indico;if not, see <http://www.gnu.org/licenses/>.

from __future__ import absolute_import

import os
import time

from flask import request, redirect, url_for
from flask import current_app as app
from flask import send_file as _send_file
from werkzeug.datastructures import Headers, FileStorage
from werkzeug.exceptions import NotFound

from MaKaC.common import Config
from MaKaC.plugins.base import RHMapMemory
from indico.util.caching import memoize
from indico.web.rh import RHHtdocs


def _convert_request_value(x):
    if isinstance(x, unicode):
        return x.encode('utf-8')
    elif isinstance(x, FileStorage):
        x.file = x.stream
        return x
    raise ValueError('Unexpected item in request data: %s' % type(x))


def create_flat_args():
    args = request.args.copy()
    args.update(request.form)
    args.update(request.files)
    flat_args = {}
    for key, item in args.iterlists():
        flat_args[key] = map(_convert_request_value, item) if len(item) > 1 else _convert_request_value(item[0])
    return flat_args


@memoize
def rh_as_view(rh):
    if issubclass(rh, RHHtdocs):
        def wrapper(filepath, plugin=None):
            path = rh.calculatePath(filepath, plugin=plugin)
            if not os.path.isfile(path):
                raise NotFound
            return _send_file(path)
    else:
        def wrapper(**kwargs):
            params = create_flat_args()
            params.update(kwargs)
            return rh(None).process(params)

    wrapper.__name__ = rh.__name__
    wrapper.__doc__ = rh.__doc__
    return wrapper


def shorturl_handler(what, tag):
    if what == 'categ':
        return redirect(url_for('legacy.categoryDisplay', categId=tag))
    elif what == 'event':
        from MaKaC.webinterface.rh.conferenceDisplay import RHShortURLRedirect
        return RHShortURLRedirect(None).process({'tag': tag})


def send_file(name, path_or_fd, mimetype, last_modified=None, no_cache=True, inline=True, conditional=False):
    # Note: path can also be a StringIO!
    if request.user_agent.platform == 'android':
        # Android is just full of fail when it comes to inline content-disposition...
        inline = False
    if mimetype.isupper() and '/' not in mimetype:
        # Indico file type such as "JPG" or "CSV"
        mimetype = Config.getInstance().getFileTypeMimeType(mimetype)
    rv = _send_file(path_or_fd, mimetype=mimetype, as_attachment=not inline, attachment_filename=name,
                    conditional=conditional)
    if inline:
        # send_file does not add this header if as_attachment is False
        rv.headers.add('Content-Disposition', 'inline', filename=name)
    if last_modified:
        if not isinstance(last_modified, int):
            last_modified = int(time.mktime(last_modified.timetuple()))
        rv.last_modified = last_modified
    if no_cache:
        del rv.expires
        del rv.cache_control.max_age
        rv.cache_control.public = False
        rv.cache_control.private = True
        rv.cache_control.no_cache = True
    return rv


class ResponseUtil(object):
    """This class allows "modifying" a Response object before it is actually created.

    The purpose of this is to allow e.g. an Indico RH to trigger a redirect but revoke
    it later in case of an error or to simply have something to pass around to functions
    which want to modify headers while there is no response available.
    """

    def __init__(self):
        self.headers = Headers()
        self._redirect = None
        self.status = 200
        self.content_type = None

    @property
    def modified(self):
        return bool(self.headers) or self._redirect or self.status != 200 or self.content_type

    @property
    def redirect(self):
        return self._redirect

    @redirect.setter
    def redirect(self, value):
        if value is None:
            pass
        elif isinstance(value, tuple) and len(value) == 2:
            pass
        else:
            raise ValueError('redirect must be None or a 2-tuple containing URL and status code')
        self._redirect = value

    def make_empty(self):
        return self.make_response('')

    def make_redirect(self):
        if not self._redirect:
            raise Exception('Cannot create a redirect response without a redirect')
        return redirect(*self.redirect)

    def make_response(self, res):
        if isinstance(res, app.response_class):
            if self.modified:
                # If we receive a response - most likely one created by send_file - we do not allow any
                # external modifications.
                raise Exception('Cannot combine response object with custom modifications')
            return res

        if self._redirect:
            return self.make_redirect()

        res = app.make_response((res, self.status, self.headers))
        if self.content_type:
            res.content_type = self.content_type
        return res


class XAccelMiddleware(object):
    """A WSGI Middleware that converts X-Sendfile headers to X-Accel-Redirect
    headers if possible.

    If the path is not mapped to a URI usable for X-Sendfile we abort with an
    error since it likely means there is a misconfiguration.
    """

    def __init__(self, app, mapping):
        self.app = app
        self.mapping = mapping.items()

    def __call__(self, environ, start_response):
        def _start_response(status, headers, exc_info=None):
            xsf_path = None
            new_headers = []
            for name, value in headers:
                if name.lower() == 'x-sendfile':
                    xsf_path = value
                else:
                    new_headers.append((name, value))
            if xsf_path:
                uri = self.make_x_accel_header(xsf_path)
                if not uri:
                    raise ValueError('Could not map %s to an URI' % xsf_path)
                new_headers.append(('X-Accel-Redirect', uri))
            return start_response(status, new_headers, exc_info)

        return self.app(environ, _start_response)

    def make_x_accel_header(self, path):
        for base, uri in self.mapping:
            if path.startswith(base + '/'):
                return uri + path[len(base):]
