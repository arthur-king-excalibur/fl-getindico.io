# -*- coding: utf-8 -*-
##
##
## This file is part of Indico.
## Copyright (C) 2002 - 2014 European Organization for Nuclear Research (CERN).
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


import posixpath
from flask import request, session
from urlparse import urlparse
from indico.web import assets

import MaKaC.webinterface.wcomponents as wcomponents
import MaKaC.webinterface.urlHandlers as urlHandlers
from MaKaC.plugins.base import OldObservable
from indico.core.config import Config
from MaKaC.common.info import HelperMaKaCInfo
from MaKaC.i18n import _
from indico.util.i18n import i18nformat


class WPBase(OldObservable):
    """
    """
    _title = "Indico"

    # required user-specific "data packages"
    _userData = []

    def __init__(self, rh, **kwargs):
        config = Config.getInstance()
        self._rh = rh
        self._kwargs = kwargs
        self._locTZ = ""

        self._dir = config.getTPLDir()
        self._asset_env = assets.core_env

        #store page specific CSS and JS
        self._extraCSS = []
        self._extraJS = []

    def _getBaseURL(self):
        if request.is_secure and Config.getInstance().getBaseSecureURL():
            return Config.getInstance().getBaseSecureURL()
        else:
            return Config.getInstance().getBaseURL()

    def _getTitle(self):
        return self._title

    def _setTitle(self, newTitle):
        self._title = newTitle.strip()

    def getCSSFiles(self):
        return self._asset_env['base_css'].urls() + \
            self._asset_env['screen_sass'].urls()

    def _getJavaScriptInclude(self, scriptPath):
        return '<script src="'+ scriptPath +'" type="text/javascript"></script>\n'

    def getJSFiles(self):
        return self._asset_env['base_js'].urls()

    def _includeJSPackage(self, pkg_names):
        if not isinstance(pkg_names, list):
            pkg_names = [pkg_names]

        return [url
                for pkg_name in pkg_names
                for url in self._asset_env['indico_' + pkg_name.lower()].urls()]

    def _getJavaScriptUserData(self):
        """
        Returns structured data that should be passed on to the client side
        but depends on user data (can't be in vars.js.tpl)
        """

        user = self._getAW().getUser()

        from MaKaC.webinterface.asyndico import UserDataFactory

        userData = dict((packageName,
                         UserDataFactory(user).build(packageName))
                        for packageName in self._userData)

        return userData

    def _getHeadContent( self ):
        """
        Returns _additional_ content between <head></head> tags.
        Please note that <title>, <meta> and standard CSS are always included.

        Override this method to add your own, page-specific loading of
        JavaScript, CSS and other legal content for HTML <head> tag.
        """
        return ""

    def _getWarningMessage(self):
        return ""

    def _getHTMLHeader( self ):
        from MaKaC.webinterface.pages.conferences import WPConfSignIn
        from MaKaC.webinterface.pages.signIn import WPSignIn
        from MaKaC.webinterface.pages.registrationForm import WPRegistrationFormSignIn
        from MaKaC.webinterface.rh.base import RHModificationBaseProtected
        from MaKaC.webinterface.rh.admins import RHAdminBase

        area=""
        if isinstance(self._rh, RHModificationBaseProtected):
            area=i18nformat(""" - _("Management area")""")
        elif isinstance(self._rh, RHAdminBase):
            area=i18nformat(""" - _("Administrator area")""")

        info = HelperMaKaCInfo().getMaKaCInfoInstance()

        return wcomponents.WHTMLHeader().getHTML({
            "area": area,
            "baseurl": self._getBaseURL(),
            "conf": Config.getInstance(),
            "page": self,
            "extraCSS": map(self._fix_path, self.getCSSFiles()),
            "extraJSFiles": map(self._fix_path, self.getJSFiles()),
            "extraJS": self._extraJS,
            "language": session.lang,
            "social": info.getSocialAppConfig(),
            "assets": self._asset_env
        })

    def _fix_path(self, path):
        url_path = urlparse(Config.getInstance().getBaseURL()).path or '/'
        if path[0] != '/':
            path = posixpath.join(url_path, path)
        return path

    def _getHTMLFooter( self ):
        return """
    </body>
</html>
               """

    def _display( self, params ):
        """
        """
        return _("no content")

    def _getAW( self ):
        return self._rh.getAW()

    def display( self, **params ):
        """
        """
        return "%s%s%s"%( self._getHTMLHeader(), \
                            self._display( params ), \
                            self._getHTMLFooter() )


    def addExtraJSFile(self, filename):
        self._extraJSFiles.append(filename)

    def addExtraJS(self, jsCode):
        self._extraJS.append(jsCode)

    # auxiliar functions
    def _escapeChars(self, text):
        # Not doing anything right now - it used to convert % to %% for old-style templates
        return text


class WPDecorated(WPBase):

    def _getSiteArea(self):
        return "DisplayArea"

    def getLoginURL( self ):
        return urlHandlers.UHSignIn.getURL(request.url)

    def getLogoutURL( self ):
        return urlHandlers.UHSignOut.getURL(request.url)


    def _getHeader( self ):
        """
        """
        wc = wcomponents.WHeader( self._getAW(), isFrontPage=self._isFrontPage(), currentCategory=self._currentCategory(), locTZ=self._locTZ )

        return wc.getHTML( { "subArea": self._getSiteArea(), \
                             "loginURL": self._escapeChars(str(self.getLoginURL())),\
                             "logoutURL": self._escapeChars(str(self.getLogoutURL())) } )

    def _getTabControl(self):
        return None

    def _getFooter( self):
        """
        """
        wc = wcomponents.WFooter(isFrontPage=self._isFrontPage())
        return wc.getHTML({ "subArea": self._getSiteArea() })

    def _applyDecoration( self, body ):
        """
        """
        return "<div class=\"wrapper\"><div class=\"main\">%s%s</div></div>%s"%( self._getHeader(), body, self._getFooter() )

    def _display(self, params):
        params = dict(params, **self._kwargs)
        return self._applyDecoration(self._getBody(params))

    def _getBody( self, params ):
        """
        """
        pass

    def _getNavigationDrawer(self):
        return None

    def _isFrontPage(self):
        """
            Welcome page class overloads this, so that additional info (news, policy)
            is shown.
        """
        return False

    def _isRoomBooking(self):
        return False

    def _currentCategory(self):
        """
            Whenever in category display mode this is overloaded with the current category
        """
        return None

    def _getSideMenu(self):
        """
            Overload and return side menu whenever there is one
        """
        return None

    def getJSFiles(self):
        pluginJSFiles = {"paths" : []}
        self._notify("includeMainJSFiles", pluginJSFiles)
        return WPBase.getJSFiles(self) + pluginJSFiles['paths']


class WPNotDecorated(WPBase):

    def getLoginURL(self):
        return urlHandlers.UHSignIn.getURL(request.url)

    def getLogoutURL(self):
        return urlHandlers.UHSignOut.getURL(request.url)

    def _display(self, params):
        params = dict(params, **self._kwargs)
        return self._getBody(params)

    def _getBody(self, params):
        pass

    def _getNavigationDrawer(self):
        return None



