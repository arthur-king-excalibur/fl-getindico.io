# -*- coding: utf-8 -*-
##
## $Id: person_titles.py,v 1.8 2009/06/02 12:22:48 jose Exp $
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

from xml.sax.saxutils import quoteattr, escape
from MaKaC.i18n import _

class TitlesRegistry:
    
    _items = ["", "Mr.", "Ms.", "Mrs.", "Dr.", "Prof."]

    @classmethod
    def getList( cls ):
        return cls._items
        
    @classmethod
    def getSelectItemsHTML( cls, selTitle="" ):
        l=[]
        for title in cls._items:
            selected=""
            if title==selTitle:
                selected=" selected"
            if title != "":
                title=_(title)
            l.append("""<option value=%s%s>%s</option>"""%(quoteattr(title),
                                        selected, escape(title)))
        return "".join(l)

