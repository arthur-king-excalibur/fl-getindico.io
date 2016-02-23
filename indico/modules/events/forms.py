# This file is part of Indico.
# Copyright (C) 2002 - 2016 European Organization for Nuclear Research (CERN).
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

from flask import session, request
from wtforms.fields import StringField, SelectField, TextAreaField, HiddenField
from wtforms.fields.html5 import URLField
from wtforms.validators import DataRequired, ValidationError

from indico.core.db import db
from indico.util.i18n import _
from indico.web.forms.base import IndicoForm
from indico.modules.events.models.references import ReferenceType, EventReference
from indico.web.forms.fields import HiddenFieldList, IndicoStaticTextField, ReferencesField
from indico.web.forms.widgets import CKEditorWidget


class ReferenceTypeForm(IndicoForm):
    name = StringField(_("Name"), [DataRequired()], description=_("The name of the external ID type"))
    url_template = URLField(_("URL template"),
                            description=_("The URL template must contain the '{value}' placeholder."))
    scheme = StringField(_("Scheme"), filters=[lambda x: x.rstrip(':') if x else x],
                         description=_("The scheme/protocol of the external ID type"))

    def __init__(self, *args, **kwargs):
        self.reference_type = kwargs.pop('reference_type', None)
        super(ReferenceTypeForm, self).__init__(*args, **kwargs)

    def validate_name(self, field):
        query = ReferenceType.find(db.func.lower(ReferenceType.name) == field.data.lower())
        if self.reference_type:
            query = query.filter(ReferenceType.id != self.reference_type.id)
        if query.count():
            raise ValidationError(_("This name is already in use."))

    def validate_url_template(self, field):
        if field.data and '{value}' not in field.data:
            raise ValidationError(_("The URL template must contain the placeholder '{value}'."))


class EmailEventPersonsForm(IndicoForm):
    from_address = SelectField(_('From'), [DataRequired()], choices=[(1, 1)])
    subject = StringField(_('Subject'), [DataRequired()])
    body = TextAreaField(_('Email body'), [DataRequired()], widget=CKEditorWidget(simple=True))
    recipients = IndicoStaticTextField(_('Recipients'))
    person_id = HiddenFieldList(validators=[DataRequired()])
    submitted = HiddenField()

    def __init__(self, *args, **kwargs):
        super(EmailEventPersonsForm, self).__init__(*args, **kwargs)
        from_addresses = ['{} <{}>'.format(session.user.full_name, email)
                          for email in sorted(session.user.all_emails, key=lambda x: x != session.user.email)]
        self.from_address.choices = zip(from_addresses, from_addresses)

    def is_submitted(self):
        return super(EmailEventPersonsForm, self).is_submitted() and 'submitted' in request.form


class EventReferencesForm(IndicoForm):
    references = ReferencesField(_('External IDs'), reference_class=EventReference,
                                 description=_("Manage external resources for this event"))
