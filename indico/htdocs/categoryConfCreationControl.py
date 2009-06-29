# -*- coding: utf-8 -*-
##
## $Id: categoryConfCreationControl.py,v 1.5 2008/04/24 16:59:36 jose Exp $
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

import MaKaC.webinterface.rh.categoryMod as categoryMod


def index(req, **params):
    return categoryMod.RHCategoryConfCreationControl( req ).process( params )

def setCreateConferenceControl( req, **params ):
    return categoryMod.RHCategorySetConfControl( req ).process( params )

def selectAllowedToCreateConf( req, **params ):
    return categoryMod.RHCategorySelectConfCreators( req ).process( params )

def addAllowedToCreateConferences( req, **params ):
    return categoryMod.RHCategoryAddConfCreators( req ).process( params )

def removeAllowedToCreateConferences( req, **params ):
    return categoryMod.RHCategoryRemoveConfCreators( req ).process( params )

def setNotifyCreation( req, **params ):
    return categoryMod.RHCategorySetNotifyCreation( req ).process( params )
