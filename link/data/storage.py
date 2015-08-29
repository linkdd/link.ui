# -*- utf-8 -*-

from link.middleware.base import Middleware
from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Parameter


CONF_PATH = 'middleware/storage.conf'
CATEGORY = 'STORAGE'
CONTENT = [
    Parameter('db')
]


@conf_paths(CONF_PATH)
@add_category(CATEGORY)
class Storage(Middleware):

    __protocol__ = 'storage'

    @property
    def db(self):
        if not hasattr(self, '_db'):
            self.db = None

        return self._db

    @db.setter
    def db(self, value):
        if value is None:
            value = self.datascope

        self._db = value

    def __init__(self, db=None, *args, **kwargs):
        super(Storage, self).__init__(*args, **kwargs)

        if db is not None:
            self.db = db

    def find(self, filter):
        raise NotImplementedError()

    def insert(self, records):
        raise NotImplementedError()

    def save(self, records):
        raise NotImplementedError()

    def update(self, filter, batch):
        raise NotImplementedError()

    def delete(self, filter):
        raise NotImplementedError()
