# -*- coding: utf-8 -*-
##
##
## This file is part of Indico.
## Copyright (C) 2002 - 2012 European Organization for Nuclear Research (CERN).
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
## along with Indico;if not, see <http://www.gnu.org/licenses/>.

from MaKaC.webinterface.rh import conferenceModif
from MaKaC.webinterface.rh import conferenceDisplay


def index( req, **params ):
    return conferenceModif.RHConfModifSchedule( req ).process( params )

def addContrib(req,**params):
    return conferenceModif.RHScheduleAddContrib(req).process(params)

def addBreak( req, **params ):
    return conferenceModif.RHConfAddBreak( req ).process( params )

def performAddBreak( req, **params ):
    return conferenceModif.RHConfPerformAddBreak( req ).process( params )

def modifyBreak( req, **params ):
    return conferenceModif.RHConfModifyBreak( req ).process( params )

def performModifyBreak( req, **params ):
    return conferenceModif.RHConfPerformModifyBreak( req ).process( params )

def deleteItems( req, **params ):
    return conferenceModif.RHConfDelSchItems( req ).process( params )

def editContrib(req,**params):
    return conferenceModif.RHSchEditContrib( req ).process( params )

def editSlot(req,**params):
    return conferenceModif.RHSchEditSlot( req ).process( params )

def remSlot(req,**params):
    return conferenceModif.RHSlotRem( req ).process( params )

def remSession(req,**params):
    return conferenceModif.RHSessionRem( req ).process( params )

def edit(req,**params):
    return conferenceModif.RHScheduleDataEdit( req ).process( params )

def moveSession(req,**params):
    return conferenceModif.RHScheduleSessionMove( req ).process( params )

def moveEntryUp(req, **params):
    return conferenceModif.RHScheduleMoveEntryUp( req ).process( params )

def moveEntryDown(req, **params):
    return conferenceModif.RHScheduleMoveEntryDown( req ).process( params )

def reschedule(req, **params):
    return conferenceModif.RHReschedule( req ).process( params )

def relocate(req, **params):
    return conferenceModif.RHRelocate( req ).process( params )

#################################################
# added by nmichel - export timetable to PDF    #
# (code taken from conferenceTimeTable.py)      #
#################################################
def customizePdf(req, **params ):
    return conferenceDisplay.RHTimeTableCustomizePDF( req ).process( params )

def pdf(req, **params ):
    return conferenceDisplay.RHTimeTablePDF( req ).process( params )
