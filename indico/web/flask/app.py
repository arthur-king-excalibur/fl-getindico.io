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
import re
from flask import send_from_directory, request
from flask import current_app as app
from werkzeug.exceptions import NotFound

from MaKaC.common import Config
from MaKaC.common.db import DBMgr
from MaKaC.common.info import HelperMaKaCInfo
from MaKaC.common.logger import Logger
from MaKaC.i18n import _
from MaKaC.plugins.base import RHMapMemory
from MaKaC.webinterface.pages.error import WErrorWSGI

from indico.web.flask.util import XAccelMiddleware, make_compat_blueprint, ListConverter
from indico.web.flask.wrappers import IndicoFlask
from indico.web.flask.blueprints.legacy import legacy
from indico.web.flask.blueprints.legacy_scripts import legacy_scripts
from indico.web.flask.blueprints.rooms import rooms
from indico.web.flask.blueprints.api import api
from indico.web.flask.blueprints.misc import misc
from indico.web.flask.blueprints.user import user
from indico.web.flask.blueprints.oauth import oauth
from indico.web.flask.blueprints.category import category
from indico.web.flask.blueprints.event import event
from indico.web.flask.blueprints.files import files
from indico.web.flask.blueprints.admin import admin
from indico.web.flask.blueprints.rooms_admin import rooms_admin


BLUEPRINTS = (legacy, legacy_scripts, api,
              misc, user, oauth, rooms, category, event, files, admin, rooms_admin)
COMPAT_BLUEPRINTS = map(make_compat_blueprint, (misc, user, oauth, rooms, category, event, files, admin, rooms_admin))


def fix_root_path(app):
    """Fix the app's root path when using namespace packages.

    Flask's get_root_path is not reliable in this case so we derive it from
    __name__ and __file__ instead."""

    # __name__:       'indico.web.flask.app'
    # __file__:  '..../indico/web/flask/app.py'
    # For each dot in the module name we go up one path segment
    up_segments = ['..'] * __name__.count('.')
    app.root_path = os.path.normpath(os.path.join(__file__, *up_segments))


def configure_app(app):
    cfg = Config.getInstance()
    app.config['PROPAGATE_EXCEPTIONS'] = True
    app.config['SESSION_COOKIE_NAME'] = 'indico_session'
    app.config['PERMANENT_SESSION_LIFETIME'] = cfg.getSessionLifetime()
    app.config['INDICO_SESSION_PERMANENT'] = cfg.getSessionLifetime() > 0
    app.config['INDICO_HTDOCS'] = cfg.getHtdocsDir()
    app.config['INDICO_COMPAT_ROUTES'] = cfg.getRouteOldUrls()
    static_file_method = cfg.getStaticFileMethod()
    if static_file_method:
        app.config['USE_X_SENDFILE'] = True
        method, args = static_file_method
        if method in ('xsendfile', 'lighttpd'):  # apache mod_xsendfile, lighttpd
            pass
        elif method in ('xaccelredirect', 'nginx'):  # nginx
            if not args or not hasattr(args, 'items'):
                raise ValueError('StaticFileMethod args must be a dict containing at least one mapping')
            app.wsgi_app = XAccelMiddleware(app.wsgi_app, args)
        else:
            raise ValueError('Invalid static file method: %s' % method)


def extend_url_map(app):
    app.url_map.converters['list'] = ListConverter


def add_handlers(app):
    app.register_error_handler(404, handle_404)
    app.register_error_handler(Exception, handle_exception)


def add_blueprints(app):
    for blueprint in BLUEPRINTS:
        app.register_blueprint(blueprint)


def add_compat_blueprints(app):
    for blueprint in COMPAT_BLUEPRINTS:
        app.register_blueprint(blueprint)


def add_plugin_blueprints(app):
    for blueprint in RHMapMemory()._blueprints:
        app.register_blueprint(blueprint)


def handle_404(exception):
    try:
        if re.search(r'\.py(?:/\S+)?$', request.path):
            # While not dangerous per so, we never serve *.py files as static
            raise NotFound
        try:
            return send_from_directory(app.config['INDICO_HTDOCS'], request.path[1:], conditional=True)
        except UnicodeEncodeError:
            raise NotFound
    except NotFound:
        if exception.description == NotFound.description:
            # The default reason is too long and not localized
            msg = (_("Page not found"), _("The page you were looking for doesn't exist."))
        else:
            msg = (_("Page not found"), exception.description)
        return WErrorWSGI(msg).getHTML(), 404


def handle_exception(exception):
    Logger.get('wsgi').exception(exception.message or 'WSGI Exception')
    with DBMgr.getInstance().global_connection():
        if HelperMaKaCInfo.getMaKaCInfoInstance().isDebugActive():
            raise
    msg = (str(exception), _("An unexpected error ocurred."))
    return WErrorWSGI(msg).getHTML(), 500


def make_app():
    # If you are reading this code and wonder how to access the app:
    # >>> from flask import current_app as app
    # This only works while inside an application context but you really shouldn't have any
    # reason to access it outside this method without being inside an application context.
    app = IndicoFlask('indico', static_folder=None)
    fix_root_path(app)
    configure_app(app)
    extend_url_map(app)
    add_handlers(app)
    add_blueprints(app)
    if app.config['INDICO_COMPAT_ROUTES']:
        add_compat_blueprints(app)
    add_plugin_blueprints(app)
    return app
