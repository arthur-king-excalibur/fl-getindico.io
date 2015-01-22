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

from MaKaC.webinterface.rh import oauth as oauth_rh
from indico.web.flask.wrappers import IndicoBlueprint


oauth = IndicoBlueprint('oauth', __name__)

# Consumer endpoints
oauth.add_url_rule('/oauth/access_token', 'oauth-access_token', oauth_rh.RHOAuthAccessTokenURL, methods=('GET', 'POST'))
oauth.add_url_rule('/oauth/authorize', 'oauth-authorize', oauth_rh.RHOAuthAuthorization, methods=('GET', 'POST'))
oauth.add_url_rule('/oauth/request_token', 'oauth-request_token', oauth_rh.RHOAuthRequestToken, methods=('GET', 'POST'))

# User endpoints: App list and authorization
with oauth.add_prefixed_rules('/user/<userId>', '/user'):
    oauth.add_url_rule('/oauth', 'oauth-userThirdPartyAuth', oauth_rh.RHOAuthUserThirdPartyAuth)
    oauth.add_url_rule('/oauth/authorize', 'oauth-thirdPartyAuth', oauth_rh.RHOAuthThirdPartyAuth)
    oauth.add_url_rule('/oauth/authorize_consumer', 'oauth-authorize_consumer', oauth_rh.RHOAuthAuthorizeConsumer)
