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
import os
import indico.ext.statistics.piwik

from indico.ext.statistics.base.implementation import BaseStatisticsImplementation, JSHookBase

from MaKaC.plugins.base import PluginsHolder


def _joinSegmentString(segment, delim):
    """ Utility function whilst building the query objects, substitute's Python's
        list implementation's lack of .join()
    """
    return reduce(lambda x, y: str(x) + delim + str(y), segment)

class PiwikStatisticsImplementation(BaseStatisticsImplementation):

    QUERY_SCRIPT = 'piwik.php'
    QUERY_KEY_NAME = 'token_auth'

    _pluginName = 'Piwik'

    def __init__(self):
        super(PiwikStatisticsImplementation, self).__init__()
        self._pluginImplementationPackage = indico.ext.statistics.piwik

        self.setAPIToken(self._getSavedAPIToken())
        self.setAPISiteID(self._getSavedAPISiteID())

    def _buildPluginPath(self):
        """ Local, absolute location of plugin. """
        self._pluginFSPath = os.path.join(indico.ext.statistics.piwik.__path__)[0]

    def _getVarFromPluginStorage(self, varName):
        """ Retrieves varName from the options of the plugin. """
        piwik = PluginsHolder().getPluginType('statistics').getPlugin('piwik')
        return piwik.getOptions()[varName].getValue()

    def _getSavedAPIPath(self):
        """ Returns the String saved in the plugin configuration for the
            Piwik server URL.
        """
        return self._getVarFromPluginStorage('serverUrl')

    def _getSavedAPIToken(self):
        """ Returns the String saved in the plugin configuration for the
            Piwik token auth.
        """
        return self._getVarFromPluginStorage('serverTok')

    def _getSavedAPISiteID(self):
        """ Returns the String saved in the plugin configuration for the
            Piwik ID Site
        """
        return self._getVarFromPluginStorage('serverSiteID')

    @staticmethod
    @BaseStatisticsImplementation.memoizeReport
    def getConferenceReport(startDate, endDate, confId, contribId=None):
        """ Returns the report object which satisifies the confId given. """
        from indico.ext.statistics.piwik.reports import PiwikReport
        return PiwikReport(startDate, endDate, confId, contribId).fossilize()

    @staticmethod
    def getContributionReport(startDate, endDate, confId, contribId):
        """ Returns the report object for the contribId given. """
        return PiwikStatisticsImplementation.getConferenceReport(startDate, endDate,
                                                                 confId, contribId)

    def getJSHookObject(self, instantiate=False):
        """ Returns a reference to or an instance of the JSHook class. """

        reference = indico.ext.statistics.piwik.implementation.JSHook

        return reference() if instantiate else reference

    def setAPISiteID(self, id):
        """ Piwik identifies sites by their 'idSite' attribute. """
        self.setAPIParams({'idSite' : id})

    def setAPIAction(self, action):
        self.setAPIParams({'action' : action})

    def setAPIInnerAction(self, action):
        self.setAPIParams({'apiAction' : action})

    def setAPIMethod(self, method):
        self.setAPIParams({'method' : method});

    def setAPIModule(self, module):
        self.setAPIParams({'module' : module})

    def setAPIInnerModule(self, module):
        self.setAPIParams({'apiModule' : module})

    def setAPIFormat(self, format='JSON'):
        self.setAPIParams({'format' : format})

    def setAPIPeriod(self, period='day'):
        self.setAPIParams({'period' : period})

    def setAPIDate(self, date=['last7']):
        newDate = date[0] if len(date) == 1 else _joinSegmentString(date, ',')

        self.setAPIParams({'date' : newDate})

    def setAPISegmentation(self, segmentation):
        """ segmentation = {'key' : ('equality', 'value')} """

        for segmentName in segmentation.keys():
            segmentValue = segmentation.get(segmentName)[1]
            equality = segmentation.get(segmentName)[0]
            value = ''

            if isinstance(segmentValue, list):
                value = _joinSegmentString(segmentValue, ',')
            else:
                value = str(segmentValue)

            segmentBuild = segmentName + equality + value

            if segmentBuild not in self._pluginAPISegmentation:
                self._pluginAPISegmentation.append(segmentBuild)

        segmentation = _joinSegmentString(self._pluginAPISegmentation,
                                          self.QUERY_BREAK)

        self.setAPIParams({'segment' : segmentation})

class JSHook(JSHookBase):

    varConference = 'Conference'
    varContribution = 'Contribution'

    def __init__(self, instance, extra):
        super(JSHook, self).__init__(instance)
        self.hasConfId = self.hasContribId = False
        self._buildVars(extra)

    def _buildVars(self, item):
        """ Builds the references to Conferences & Contributions. """

        if hasattr(item, '_conf'):
            self.hasConfId = True
            self.confId = item._conf.getId()

        if hasattr(item, '_contrib'):
            self.hasContribId = True
            self.contribId = item._contrib.getUniqueId()
