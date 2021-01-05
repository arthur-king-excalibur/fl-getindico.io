# This file is part of Indico.
# Copyright (C) 2002 - 2021 CERN
#
# Indico is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see the
# LICENSE file for more details.

import bcrypt


class BCryptPassword:
    def __init__(self, pwhash):
        if pwhash is not None and not isinstance(pwhash, str):
            raise TypeError(f'pwhash must be str or None, not {type(pwhash)}')
        self.hash = pwhash

    def __eq__(self, value):
        if not self.hash or not value:
            # For security reasons we never consider an empty password/hash valid
            return False
        if not isinstance(value, str):
            raise TypeError(f'password must be str, not {type(value)}')
        return bcrypt.checkpw(value.encode(), self.hash.encode())

    def __ne__(self, other):
        return not (self == other)

    def __hash__(self):  # pragma: no cover
        return hash(self.hash)

    def __repr__(self):
        return f'<BCryptPassword({self.hash})>'

    @staticmethod
    def hash(value):
        return bcrypt.hashpw(value.encode(), bcrypt.gensalt()).decode()


class PasswordProperty:
    """Define a hashed password property.

    When reading this property, it will return an object which will
    let you use the ``==`` operator to compare  the password against
    a plaintext password.  When assigning a value to it, it will be
    hashed and stored in :attr:`attr` of the containing object.

    :param attr: The attribute of the containing object where the
                 password hash is stored.
    :param backend: The password backend that handles hashing/checking
                    passwords.
    """

    def __init__(self, attr, backend=BCryptPassword):
        self.attr = attr
        self.backend = backend

    def __get__(self, instance, owner):
        return self.backend(getattr(instance, self.attr, None)) if instance is not None else self

    def __set__(self, instance, value):
        if not value:
            raise ValueError('Password may not be empty')
        setattr(instance, self.attr, self.backend.hash(value))

    def __delete__(self, instance):
        setattr(instance, self.attr, None)
