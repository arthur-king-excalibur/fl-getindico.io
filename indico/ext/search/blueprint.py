# -*- coding: utf-8 -*-
##
##
## This file is part of Indico.
## Copyright (C) 2002 - 2013 European Organization for Nuclear Research (CERN).
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
## along with Indico. If not, see <http://www.gnu.org/licenses/>.

import indico.ext.search.chrome as handlers
from indico.web.flask.util import rh_as_view
from indico.web.flask.wrappers import IndicoBlueprint


blueprint = IndicoBlueprint('search', __name__, url_prefix='/search')

blueprint.add_url_rule('', 'search', rh_as_view(handlers.RHSearchBase))
blueprint.add_url_rule('/<path:filepath>', 'htdocs', rh_as_view(handlers.RHSearchHtdocs))
