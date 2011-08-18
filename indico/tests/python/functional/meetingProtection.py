# -*- coding: utf-8 -*-
##
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

from seleniumTestCase import LoggedInSeleniumTestCase
import unittest, time, re

class MeetingProtectionTest(LoggedInSeleniumTestCase):
    def setUp(self):
        LoggedInSeleniumTestCase.setUp(self)

    def test_general_settings_test(self):
        sel = self._selenium
        sel.open("/confModifAC.py?confId=0")
        sel.click("css=input.btn")
        sel.wait_for_page_to_load("30000")
        sel.type("surname", "dummy")
        sel.click("action")
        sel.wait_for_page_to_load("30000")
        sel.click("selectedPrincipals")
        sel.click("//input[@value='select']")
        sel.wait_for_page_to_load("30000")
        sel.type("modifKey", "hhh")
        sel.click("css=#setModifKey > input.btn")
        self.assertEqual("Please note that it is more secure to make the event private instead of using a modification key.", sel.get_confirmation())
        sel.type("accessKey", "hhh")
        sel.click("css=#setAccessKey > input.btn")
        self.assertEqual("Please note that it is more secure to make the event private instead of using an access key.", sel.get_confirmation())
        sel.click("changeToPrivate")
        sel.wait_for_page_to_load("30000")
        sel.click("css=input[type=button]")
        sel.type("userSearchFocusField", "")
        sel.type("userSearchFocusField", "d")
        sel.type("userSearchFocusField", "du")
        sel.type("userSearchFocusField", "dum")
        sel.type("userSearchFocusField", "dumm")
        sel.type("userSearchFocusField", "dummy")
        sel.click("css=div.searchUsersButtonDiv > input[type=button]")
        sel.click("_GID2_existingAv0")
        sel.click("css=div.popupButtonBar > div > div > input[type=button]")
        sel.click("css=input[type=button]")
        sel.click("css=li.tabUnselected > span")
        sel.click("css=div.popupButtonBar > div > input[type=button]")
        sel.click("changeToInheriting")
        sel.wait_for_page_to_load("30000")
        sel.type("accessKey", "aaa")
        sel.click("css=#setAccessKey > input.btn")
        self.assertEqual("Please note that it is more secure to make the event private instead of using an access key.", sel.get_confirmation())
        sel.click("//input[@value='Grant submission rights to all speakers']")
        sel.wait_for_page_to_load("30000")
        sel.click("//input[@value='Grant modification rights to all session conveners']")
        sel.wait_for_page_to_load("30000")
        sel.click("//input[@value='Remove all submission rights']")
        sel.wait_for_page_to_load("30000")

    def tearDown(self):
        LoggedInSeleniumTestCase.tearDown(self)

if __name__ == "__main__":
    unittest.main()
