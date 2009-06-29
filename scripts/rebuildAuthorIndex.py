# -*- coding: utf-8 -*-
##
## $Id: rebuildAuthorIndex.py,v 1.4 2008/04/24 17:00:20 jose Exp $
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

from MaKaC.common import DBMgr
from MaKaC import conference

DBMgr.getInstance().startRequest()
error = False
ch = conference.ConferenceHolder()
for conf in ch.getList():
    conf._authorIdx=conference.AuthorIndex()
    for contrib in conf.getContributionList():
        if not isinstance(contrib.getCurrentStatus(),conference.ContribStatusWithdrawn):
            for auth in contrib.getPrimaryAuthorList():
                conf._authorIdx.index(auth)
if not error:
    DBMgr.getInstance().endRequest()
    print "No error. The change are saved"
else:
    print "There were errors. The changes was not saved"

