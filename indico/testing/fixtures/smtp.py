# This file is part of Indico.
# Copyright (C) 2002 - 2020 CERN
#
# Indico is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see the
# LICENSE file for more details.


import pytest


@pytest.fixture
def smtp(disallow_emails, smtpserver, app):
    """Wrapper for the `smtpserver` fixture which updates the Indico config
    and disables the SMTP autofail logic for that smtp server.
    """
    old_config = app.config['INDICO']
    app.config['INDICO'] = dict(app.config['INDICO'])  # make it mutable
    app.config['INDICO']['SMTP_SERVER'] = smtpserver.addr
    disallow_emails.add(smtpserver.addr[:2])  # whitelist our smtp server
    yield smtpserver
    app.config['INDICO'] = old_config
