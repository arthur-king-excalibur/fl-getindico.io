# -*- coding: utf-8 -*-
##
## $Id: abstractsManagment.py,v 1.9 2008/04/24 16:59:35 jose Exp $
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

import MaKaC.webinterface.rh.conferenceModif as conferenceModif


def index( req, **params ):
    return conferenceModif.RHAbstractList( req ).process( params )

def abstractsToPDF( req, **params ):
    return conferenceModif.RHAbstractsToPDF( req ).process( params )

def abstractsToXML( req, **params ):
    return conferenceModif.RHAbstractsToXML( req ).process( params )

def abstractsListToExcel( req, **params ):
    return conferenceModif.RHAbstractsListToExcel( req ).process( params )    

def participantList( req, **params ):
    return conferenceModif.RHAbstractsParticipantList( req ).process( params )

def abstractsActions( req, **params ):
    return conferenceModif.RHAbstractsActions( req ).process( params )

def newAbstract( req, **params ):
    return conferenceModif.RHNewAbstract( req ).process( params )

def mergeAbstracts( req, **params ):
    return conferenceModif.RHAbstractsMerge( req ).process( params )

def test( req, **params ):
    return conferenceModif.RHTest( req ).process( params )

def closeMenu( req, **params ):
    return conferenceModif.RHAbstractListMenuClose( req ).process( params )

def openMenu( req, **params ):
    return conferenceModif.RHAbstractListMenuOpen( req ).process( params )
