# This file is part of Indico.
# Copyright (C) 2002 - 2014 European Organization for Nuclear Research (CERN).
#
# Indico is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 3 of the
# License, or (at your option) any later version.
#
# Indico is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Indico; if not, see <http://www.gnu.org/licenses/>.

from MaKaC.webinterface.pages.admins import WPAdminsBase
from MaKaC.webinterface.pages.base import WPJinjaMixin
from MaKaC.webinterface.pages.conferences import WPConferenceDefaultDisplayBase
from MaKaC.webinterface.pages.registrationForm import WPConfModifRegFormBase


class WPPaymentJinjaMixin(WPJinjaMixin):
    template_prefix = 'payment/'


class WPPaymentAdmin(WPPaymentJinjaMixin, WPAdminsBase):
    def _setActiveSideMenuItem(self):
        self._paymentMenuItem.setActive()


class WPPaymentEventManagement(WPConfModifRegFormBase, WPPaymentJinjaMixin):
    def _setActiveTab(self):
        self._tabPayment.setActive()

    def _getTabContent(self, params):
        return WPPaymentJinjaMixin._getPageContent(self, params)


class WPPaymentEvent(WPConferenceDefaultDisplayBase, WPPaymentJinjaMixin):
    def _defineSectionMenu(self):
        WPConferenceDefaultDisplayBase._defineSectionMenu(self)
        self._sectionMenu.setCurrentItem(self._regFormOpt)

    def _getBody(self, params):
        return WPPaymentJinjaMixin._getPageContent(self, params)
