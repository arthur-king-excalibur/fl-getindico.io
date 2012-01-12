# -*- coding: utf-8 -*-
##
##
## This file is part of CDS Indico.
## Copyright (C) 2002, 2003, 2004, 2005, 2006, 2007 CERN.
##
## CDS Indico is free software; you can redistribute it and/or
## modify it under the terms of the GNU General Public License as
## published by the Free Software Foundation; either version 2 of the
## License, or (at your option) any later version.
##
## CDS Indico is distributed in the hope that it will be useful, but
## WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
## General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with CDS Indico; if not, write to the Free Software Foundation, Inc.,
## 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.

from MaKaC.services.implementation.base import ParameterManager
from MaKaC.services.implementation.conference import ConferenceModifBase
import MaKaC.user as user
from MaKaC.common.fossilize import fossilize
from MaKaC.user import AvatarHolder
from MaKaC.services.interface.rpc.common import ServiceError


class ChangeAbstractSubmitter(ConferenceModifBase):

    def _checkParams(self):
        ConferenceModifBase._checkParams(self)
        pm = ParameterManager(self._params)
        submitterId = pm.extract("submitterId", pType=str, allowEmpty=False)
        abstractId = pm.extract("abstractId", pType=str, allowEmpty=False)
        self._abstract = self._conf.getAbstractMgr().getAbstractById(abstractId)
        self._submitter = user.AvatarHolder().getById(submitterId)

    def _getAnswer(self):
        self._abstract.setSubmitter(self._submitter)
        return {"name": self._submitter.getFullName(),
                "affiliation": self._submitter.getAffiliation(),
                "email": self._submitter.getEmail()}


class AddLateSubmissionAuthUser(ConferenceModifBase):

    def _checkParams(self):
        ConferenceModifBase._checkParams(self)
        pm = ParameterManager(self._params)
        self._userList = pm.extract("userList", pType=list, allowEmpty=False)

    def _getAnswer(self):
        ah = AvatarHolder()
        for user in self._userList:
            if user["id"] != None:
                self._conf.getAbstractMgr().addAuthorizedSubmitter(ah.getById(user["id"]))
            else:
                raise ServiceError("ERR-U0", _("User does not exist."))
        return fossilize(self._conf.getAbstractMgr().getAuthorizedSubmitterList())


class RemoveLateSubmissionAuthUser(ConferenceModifBase):

    def _checkParams(self):
        ConferenceModifBase._checkParams(self)
        pm = ParameterManager(self._params)
        ah = AvatarHolder()
        userId = pm.extract("userId", pType=str, allowEmpty=False)
        self._user = ah.getById(userId)
        if self._user == None:
            raise ServiceError("ERR-U0", _("User '%s' does not exist.") % userId)

    def _getAnswer(self):
        self._conf.getAbstractMgr().removeAuthorizedSubmitter(self._user)
        return fossilize(self._conf.getAbstractMgr().getAuthorizedSubmitterList())


methodMap = {
    "changeSubmitter": ChangeAbstractSubmitter,
    "lateSubmission.addExistingLateAuthUser": AddLateSubmissionAuthUser,
    "lateSubmission.removeLateAuthUser": RemoveLateSubmissionAuthUser
    }
