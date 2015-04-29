# This file is part of Indico.
# Copyright (C) 2002 - 2015 European Organization for Nuclear Research (CERN).
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

from flask import render_template
from wtforms.widgets.core import HTMLString, PasswordInput


class ConcatWidget(object):
    """Renders a list of fields as a simple string joined by an optional separator."""
    def __init__(self, separator='', prefix_label=True):
        self.separator = separator
        self.prefix_label = prefix_label

    def __call__(self, field, label_args=None, field_args=None, **kwargs):
        label_args = label_args or {}
        field_args = field_args or {}
        html = []
        for subfield in field:
            fmt = u'{0} {1}' if self.prefix_label else u'{1} {0}'
            html.append(fmt.format(subfield.label(**label_args), subfield(**field_args)))
        return HTMLString(self.separator.join(html))


class PrincipalWidget(object):
    """Renders a user/group selector widget"""
    def __call__(self, field, **kwargs):
        return HTMLString(render_template('forms/principal_widget.html', field=field))


class JinjaWidget(object):
    """Renders a field using a custom Jinja template"""
    def __init__(self, template, plugin=None, **context):
        self.template = template
        self.plugin = plugin
        self.context = context

    def __call__(self, field, **kwargs):
        if self.plugin:
            plugin = self.plugin
            if hasattr(plugin, 'name'):
                plugin = plugin.name
            template = '{}:{}'.format(plugin, self.template)
        else:
            template = self.template

        return HTMLString(render_template(template, field=field, **dict(self.context, **kwargs)))


class PasswordWidget(object):
    """Renders a password input"""

    single_line = True

    def __call__(self, field, **kwargs):
        return HTMLString(render_template('forms/password_widget.html', field=field, input_args=kwargs))


class SyncWidget(object):
    """Renders a text input with a sync addon button"""

    single_line = True

    def __call__(self, field, **kwargs):
        return HTMLString(render_template('forms/synced_widget.html', field=field, input_args=kwargs))


class CKEditorWidget(JinjaWidget):
    """Renders a CKEditor WYSIWYG editor"""
    def __init__(self, simple=False):
        super(CKEditorWidget, self).__init__('forms/ckeditor_widget.html', simple=simple)


class RadioButtonsWidget(JinjaWidget):
    """Renders a radio button group"""
    def __init__(self):
        super(RadioButtonsWidget, self).__init__('forms/radio_buttons_widget.html')


class SwitchWidget(object):
    """Renders a switch widget"""
    def __init__(self, on_label=None, off_label=None):
        """
        :param on_label: Text to override default ON label
        :param off_label: Text to override default OFF label
        """
        self.on_label = on_label
        self.off_label = off_label

    def __call__(self, field, **kwargs):
        kwargs.update({
            'checked':  getattr(field, 'checked', field.data),
            'on_label': self.on_label,
            'off_label': self.off_label
        })
        return HTMLString(render_template('forms/switch_widget.html', field=field, kwargs=kwargs))


class SelectizeWidget(object):
    """Renders a selectizer-based widget"""
    def __call__(self, field, **kwargs):
        choices = []
        if field.data is not None:
            choices.append({'name': field.data.name, 'id': field.data.id})

        options = {
            'valueField': 'id',
            'labelField': 'name',
            'searchField': 'name',
            'persist': False,
            'options': choices,
            'create': False,
            'maxItems': 1,
            'closeAfterSelect': True
        }

        options.update(kwargs.pop('options', {}))
        return HTMLString(render_template('forms/selectize_widget.html', field=field, options=options))
