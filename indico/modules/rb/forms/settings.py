# This file is part of Indico.
# Copyright (C) 2002 - 2017 European Organization for Nuclear Research (CERN).
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

from __future__ import unicode_literals

from wtforms.fields.core import BooleanField, IntegerField, StringField
from wtforms.validators import InputRequired, NumberRange

from indico.util.i18n import _
from indico.web.forms.base import IndicoForm
from indico.web.forms.fields import EmailListField, PrincipalListField


class SettingsForm(IndicoForm):
    admin_principals = PrincipalListField(_('Administrators'), groups=True)
    authorized_principals = PrincipalListField(_('Authorized users/groups'), groups=True)
    assistance_emails = EmailListField(_('Assistance email addresses (one per line)'))
    notification_before_days = IntegerField(_('Send booking reminders X days before (single/daily)'),
                                            [InputRequired(), NumberRange(min=1, max=30)])
    notification_before_days_weekly = IntegerField(_('Send booking reminders X days before (weekly)'),
                                                   [InputRequired(), NumberRange(min=1, max=30)])
    notification_before_days_monthly = IntegerField(_('Send booking reminders X days before (monthly)'),
                                                    [InputRequired(), NumberRange(min=1, max=30)])
    notifications_enabled = BooleanField(_('Reminders enabled'))
    vc_support_emails = EmailListField(_('Videoconference support email addresses (one per line)'))
    booking_limit = IntegerField(_('Maximum length of booking (days)'), [InputRequired(), NumberRange(min=1)])
