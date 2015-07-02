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

from __future__ import unicode_literals

import itertools

from indico.modules.attachments.controllers.display.event import RHDownloadEventAttachment
from indico.modules.attachments.controllers.management.event import (RHManageEventAttachments,
                                                                     RHAddEventAttachmentFiles,
                                                                     RHAddEventAttachmentLink,
                                                                     RHEditEventAttachment,
                                                                     RHCreateEventFolder,
                                                                     RHEditEventFolder,
                                                                     RHDeleteEventFolder,
                                                                     RHDeleteEventAttachment)
from indico.modules.events import event_management_object_url_prefixes, event_object_url_prefixes
from indico.web.flask.wrappers import IndicoBlueprint

_bp = IndicoBlueprint('attachments', __name__, template_folder='templates', virtual_template_folder='attachments')

for object_type, prefixes in event_management_object_url_prefixes.iteritems():
    for prefix in prefixes:
        prefix = '/event/<confId>' + prefix
        _bp.add_url_rule(prefix + '/attachments/', 'event_management', RHManageEventAttachments,
                         defaults={'object_type': object_type})
        _bp.add_url_rule(prefix + '/attachments/add/files', 'upload', RHAddEventAttachmentFiles,
                         methods=('GET', 'POST'), defaults={'object_type': object_type})
        _bp.add_url_rule(prefix + '/attachments/add/link', 'add_link', RHAddEventAttachmentLink,
                         methods=('GET', 'POST'), defaults={'object_type': object_type})
        _bp.add_url_rule(prefix + '/attachments/<int:folder_id>/<int:attachment_id>/', 'modify_attachment',
                         RHEditEventAttachment, methods=('GET', 'POST'), defaults={'object_type': object_type})
        _bp.add_url_rule(prefix + '/attachments/create-folder', 'create_folder', RHCreateEventFolder,
                         methods=('GET', 'POST'), defaults={'object_type': object_type})
        _bp.add_url_rule(prefix + '/attachments/<int:folder_id>/', 'edit_folder', RHEditEventFolder,
                         methods=('GET', 'POST'), defaults={'object_type': object_type})
        _bp.add_url_rule(prefix + '/attachments/<int:folder_id>/', 'delete_folder', RHDeleteEventFolder,
                         methods=('DELETE',), defaults={'object_type': object_type})
        _bp.add_url_rule(prefix + '/attachments/<int:folder_id>/<int:attachment_id>/', 'delete_attachment',
                         RHDeleteEventAttachment, methods=('DELETE',), defaults={'object_type': object_type})


for prefix in itertools.chain.from_iterable(event_object_url_prefixes.itervalues()):
    prefix = '/event/<confId>' + prefix
    _bp.add_url_rule(prefix + '/attachments/<int:folder_id>/<int:attachment_id>/<filename>', 'download',
                     RHDownloadEventAttachment)
