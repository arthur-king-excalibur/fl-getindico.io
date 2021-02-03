# This file is part of Indico.
# Copyright (C) 2002 - 2021 CERN
#
# Indico is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see the
# LICENSE file for more details.

from indico.core.cache import cache, make_scoped_cache


def test_cache_none_default():
    assert cache.get('foo') is None
    assert cache.get('foo', 'bar') == 'bar'
    cache.set('foo', None)
    cache.set('bar', 0)
    cache.add('foobar', None)
    cache.add('foobar', 'nope')
    assert cache.get('foo') is None
    assert cache.get('foo', 'bar') is None
    assert cache.get('foobar') is None
    assert cache.get('foobar', 'bar') is None
    assert cache.get_dict('foo', 'bar', 'foobar') == {'foo': None, 'bar': 0, 'foobar': None}
    assert cache.get_dict('foo', 'bar', 'foobar', default='x') == {'foo': 'x', 'bar': 0, 'foobar': 'x'}
    assert cache.get_many('foo', 'bar', 'foobar') == [None, 0, None]
    assert cache.get_many('foo', 'bar', 'foobar', default='x') == ['x', 0, 'x']


def test_scoped_cache():
    cache.set('foo', 1)
    cache.set('foobar', 2)
    scoped = make_scoped_cache('test')
    assert scoped.get('foo', 'notset') == 'notset'

    scoped.set('foo', 'bar')
    scoped.add('foobar', 'test')
    scoped.add('foo', 'nope')

    # accessing the scope through the global cache is possibly, but should not be done
    # if this ever starts failing because we change something in the cache implementation
    # removing this particular assertion is fine
    assert cache.get('test/foo') == 'bar'

    assert scoped.get('foo') == 'bar'
    assert scoped.get_many('foo', 'foobar') == ['bar', 'test']
    assert scoped.get_dict('foo', 'foobar') == {'foo': 'bar', 'foobar': 'test'}

    scoped.delete('foobar')
    scoped.delete_many('foo')
    assert scoped.get_many('foo', 'foobar') == [None, None]

    # ensure deletions only affected the scoped keys
    assert cache.get_many('foo', 'foobar') == [1, 2]

    scoped.set_many({'a': 'aa', 'b': 'bb'})
    assert scoped.get_dict('a', 'b') == {'a': 'aa', 'b': 'bb'}

    assert cache.get_many('foo', 'foobar', 'a', 'b') == [1, 2, None, None]
