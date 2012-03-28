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
import zope.interface

from persistent import Persistent
from persistent.mapping import PersistentMapping

import indico.ext.statistics as plugbase

from indico.ext.statistics.util import getPluginType
from indico.ext.statistics.db import updateDBStructure

from MaKaC.common import DBMgr
from MaKaC.plugins.base import PluginsHolder

class StatisticsImplementationRegister(Persistent):
    """
    This register acts as both a wrapper against the legacy PluginsHolder
    and a quick-access object for injecting tracking codes etc into the
    extension points of Indico.
    """

    def __init__(self):
        super(StatisticsImplementationRegister, self).__init__()
        self._registeredImplementations = PersistentMapping()
        self._buildRegister()

    def __len__(self):
        return len(self._getRegister())

    def _buildRegister(self):
        """
        Static mapping attributes for plugin implementations in register.
        Far less expensive than previous on-instantiate-register pattern.
        """
        implementations = self._getRegister()

        if implementations:
            return

        # Append lines to add further implementations.
        implementations['Piwik'] = plugbase.piwik.implementation.PiwikStatisticsImplementation

    def _getPluginOSPath(self):
        """
        Returns the absolute OS path to this plugin, with ending slash included.
        """
        import indico.ext.statistics
        return os.path.join(indico.ext.statistics.__path__)[0] + '/'

    def _getRegister(self):
        return self._registeredImplementations

    def _reInit(self):
        """
        Reinitialises the register, removes the saved attributes from the DB
        instance and reinstantiates based on those defined in _buildRegister()
        """
        self.clearAll()
        self._buildRegister()

    def clearAll(self):
        """
        This will kill all registrations, not fatal as they all announce
        their creation to the register upon instantiation anyway.
        """
        self._registeredImplementations = PersistentMapping()

    @staticmethod
    def getInstance():
        storage = getPluginType().getStorage()
        storage_name = 'statistics_register'

        if not storage_name in storage:
            root = DBMgr.getInstance().getDBConnection()
            updateDBStructure(root, storage_name, StatisticsImplementationRegister)

        return storage[storage_name]

    def getAllPlugins(self, instantiate=True):
        """
        Returns a list of all plugin class registered, if instantiate is
        True, instates all objects before appending to the list.
        """
        result = []

        if instantiate:
            for plugin in self._getRegister().values():
                result.append(plugin())
        else:
            result = self._getRegister().values()

        return result

    def getAllPluginNames(self):
        """
        Returns a list of all the plugin names (Strings).
        """
        return self._getRegister().keys()

    def getAllPluginJSHooks(self, extra=None):
        """
        Returns a list of JSHook objects which contain the parameters
        required to propagate a hook with the data it needs. If extra is
        defined, it is assumed that the JSHook object is expecting it as a
        parameter.
        """
        hooks = []

        for plugin in self.getAllPlugins(True):

            if extra is not None:
                hook = plugin.getJSHookObject()(plugin, extra)
            else:
                hook = plugin.getJSHookObject()(plugin)

            hooks.append(hook)

        return hooks

    def getAllPluginJSHookPaths(self):
        """
        Returns a list of all the paths to JSHook TPL files for registered
        plugins
        """
        paths = []

        for plugin in self.getAllPlugins(True):
            paths.append(plugin.getJSHookPath())

        return paths

    def getJSInjectionPath(self):
        """
        Returns the path to the loop tpl file to inject different hooks into
        events.
        """
        filename = 'StatisticsHookInjection.tpl'
        return self._getPluginOSPath() + 'tpls/' + filename

    def getPluginByName(self, plugin, instantiate=True):
        """
        Returns an individual plugin from the register by name of class,
        returns an instantiated method if instantiate set to True.
        """
        if plugin in self._getRegister():
            if not instantiate:
                return self._getRegister()[plugin]
            else:
                return self._getRegister()[plugin]()
        else:
            return None


class StatisticsConfig(object):
    """
    The current overall configuration of the plugin, wrapper around global
    options in PluginsHolder / plugin administration.
    """

    _statsPlugin = PluginsHolder().getPluginType('statistics')

    def getUpdateInterval(self):
        """
        Returns the interval for which cached values should live before
        new data is requested from the server.
        """
        return self._statsPlugin.getOptions()['cacheTTL'].getValue()

    def hasCacheEnabled(self):
        """
        True if the plugin is configured for cached reporting.
        """
        return self._statsPlugin.getOptions()['cacheEnabled'].getValue()
