# -*- coding: utf-8 -*-
##
##
## This file is part of Indico.
## Copyright (C) 2002 - 2012 European Organization for Nuclear Research (CERN).
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

"""
Module containing the MaKaC exception class hierarchy
"""

class MaKaCError(Exception):

    def __init__( self, msg="",area="", explanation = None):
        self._msg = msg
        self._area = area
        self._explanation = explanation

    def getMsg( self ):
        return self._msg

    def __str__(self):
        if self._area != "":
            return "%s - %s"%(self._area,self._msg)
        else:
            return self._msg

    def getArea(self):
        return self._area

    def getExplanation(self):
        """
        Some extra information, like actions that can be taken
        """

        return self._explanation


class AccessControlError(MaKaCError):
    """
    """
    def __init__(self, objectType="object"):
        self.objType = objectType

    def __str__( self ):
        return _("you are not authorised to access this %s")%self.objType


class ConferenceClosedError(MaKaCError):
    """
    """
    def __init__(self, conf):
        self._conf = conf

    def __str__( self ):
        return _("the event has been closed")


class DomainNotAllowedError(AccessControlError):

    def __str__( self ):
        return _("your domain is not allowed to acces this %s")%self.objType


class AccessError(AccessControlError):
    """
    """
    pass


class KeyAccessError(AccessControlError):
    """
    """
    pass


class HostnameResolveError(MaKaCError):
    """
    Hostname resolution failed
    """


class ModificationError(AccessControlError):
    """
    """
    def __str__( self ):
        return _("you are not authorised to modify this %s")%self.objType


class AdminError(AccessControlError):
    """
    """
    def __str__(self):
        return _("only administrators can access this %s")%self.objType


class WebcastAdminError(AccessControlError):
    """
    """
    def __str__(self):
        return _("only webcast administrators can access this %s")%self.objType


class TimingError(MaKaCError):
    """
    Timetable problems
    """

    def __init__(self, msg = "", area = "", explanation = None):
        MaKaCError.__init__(self, msg, area, explanation)


class ParentTimingError(TimingError):
    """
    """
    pass


class EntryTimingError(TimingError):
    """
    """
    pass


class UserError(MaKaCError):
    """
    """
    def init(self, msg = ""):
        self._msg = msg

    def __str__(self):
        if self._msg:
            return self._msg
        else:
            return _("Error creating user")


class FormValuesError(MaKaCError):
    """
    """
    def __init__( self, msg="",area=""):
        self._msg = msg
        self._area = area


class NoReportError(MaKaCError):
    """
    """
    def __init__( self, msg="", area=""):
        self._msg = msg
        self._area = area

class NotFoundError(MaKaCError):
    """
    """
    def __init__( self, msg="", area=""):
        self._msg = msg
        self._area = area


class PluginError(MaKaCError):
    pass


class HtmlScriptError(MaKaCError):
    """
    """
    pass


class HtmlForbiddenTag(MaKaCError):
    """
    """
    pass
