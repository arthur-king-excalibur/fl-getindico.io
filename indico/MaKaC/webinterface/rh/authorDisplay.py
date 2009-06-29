# -*- coding: utf-8 -*-
##
## $Id: authorDisplay.py,v 1.4 2008/04/24 16:59:18 jose Exp $
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

from MaKaC.webinterface.rh.conferenceDisplay import RHConferenceBaseDisplay
from MaKaC.webinterface.pages import authors
from MaKaC.webinterface import urlHandlers

class RHAuthorDisplayBase( RHConferenceBaseDisplay ):

    def _checkParams( self, params ):
        RHConferenceBaseDisplay._checkParams( self, params )
        self._authorId = params.get( "authorId", "" ).strip()


class RHAuthorDisplay( RHAuthorDisplayBase ):
    _uh = urlHandlers.UHContribAuthorDisplay
    
    def _process( self ):
        p = authors.WPAuthorDisplay( self, self._conf, self._authorId )
        return p.display()


        
