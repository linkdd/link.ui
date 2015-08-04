# -*- utf-8 -*-

from link.middleware.base import Middleware
from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Parameter

import os


CONF_PATH = 'data/orm.conf'
CATEGORY = 'ORM'
CONTENT = [
    Parameter('schemadir')
]


@conf_paths(CONF_PATH)
@add_category(CATEGORY, content=CONTENT)
class ObjectModel(Middleware):

    __protocol__ = 'data'
    __datatype__ = 'default'

    @property
    def schemadir(self):
        if not hasattr(self, '_schemadir'):
            self.schemadir = '~/etc/schema/data'

        return self._schemadir

    @schemadir.setter
    def schemadir(self, value):
        self._schemadir = os.path.expanduser(value)

    @property
    def schemapath(self):
        path = os.path.join(self.schemadir, '{0}.json'.format(self.datascope))

        return path

    def __init__(self, schemadir=None, *args, **kwargs):
        super(ObjectModel, self).__init__(*args, **kwargs)

        if schemadir is not None:
            self.schemadir = schemadir

    def _get_connection(self, uri):
        storage = Middleware.get_by_uri(uri)
        storage.datascope = self.datascope
        storage.connect()

        return storage

    def _is_connection_alive(self, storage):
        return storage.isconnected()

    def _deinit_connection(self, storage):
        storage.disconnect()

    @staticmethod
    def make_query(self, query, limit=None, offset=None):
        return slice(query, limit, offset)

    def __len__(self):
        return self.conn.count_elements()

    def __getitem__(self, query):
        limit = None
        offset = None

        if isinstance(query, slice):
            limit = query.stop
            offset = query.step
            query = query.start

        if isinstance(query, dict):
            return self.conn.get_elements(
                query=query,
                limit=limit,
                offset=offset
            )

        else:
            return self.conn.get_element(
                id=query
            )

    def __setitem__(self, query, document):
        limit = None
        offset = None

        if isinstance(query, slice):
            limit = query.stop
            offset = query.step
            query = query.start

        if isinstance(query, dict):
            self.conn.update_elements(
                query=query,
                batch=document,
                limit=limit,
                offset=offset
            )

        else:
            self.conn.update_element(
                id=query,
                batch=document
            )

    def __delitem__(self, query):
        limit = None
        offset = None

        if isinstance(query, slice):
            limit = query.stop
            offset = query.step
            query = query.start

        if isinstance(query, dict):
            return self.conn.remove_elements(
                query=query,
                limit=limit,
                offset=offset
            )

        else:
            return self.conn.remove_element(
                id=query
            )

    def __iter__(self):
        return iter(self[:])

    def __contains__(self, query):
        return self[query] is not None
