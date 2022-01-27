# This file is part of Indico.
# Copyright (C) 2002 - 2022 CERN
#
# Indico is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see the
# LICENSE file for more details.

from flask import redirect, request, session
from sqlalchemy.orm import defaultload

from indico.modules.events.registration.models.forms import RegistrationForm
from indico.modules.events.registration.util import (get_event_section_data, make_registration_schema,
                                                     modify_registration)
from indico.util.string import camelize_keys
from indico.web.args import parser


class RegistrationFormMixin:
    """Mixin for single registration form RH."""

    normalize_url_spec = {
        'locators': {
            lambda self: self.regform
        }
    }

    def _process_args(self):
        self.regform = (RegistrationForm.query
                        .filter_by(id=request.view_args['reg_form_id'], is_deleted=False)
                        .options(defaultload('form_items').joinedload('children').joinedload('current_data'))
                        .one())


class RegistrationEditMixin:
    def _process_POST(self):
        schema = make_registration_schema(self.regform, management=self.management, registration=self.registration)()
        form_data = parser.parse(schema)

        notify_user = not self.management or form_data.pop('notify_user', False)
        if self.management:
            session['registration_notify_user_default'] = notify_user
        modify_registration(self.registration, form_data, management=self.management, notify_user=notify_user)
        return redirect(self.success_url)

    def _process_GET(self):
        registration_data = {r.field_data.field.html_field_name: camelize_keys(r.user_data)
                             for r in self.registration.data}
        section_data = camelize_keys(get_event_section_data(self.regform, management=self.management,
                                                            registration=self.registration))

        registration_metadata = {
            'paid': self.registration.is_paid,
            'manager': self.management
        }

        return self.view_class.render_template(self.template_file, self.event,
                                               sections=section_data, regform=self.regform,
                                               registration_data=registration_data,
                                               registration_metadata=registration_metadata,
                                               registration=self.registration)
