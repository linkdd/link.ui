# -*- utf-8 -*-

from link.utils.url import urlparse, parse_qs

from b3j0f.conf.configurable import Configurable, MetaConfigurable
from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Parameter


CONF_PATH = 'middleware/middleware.conf'
CATEGORY = 'MIDDLEWARE'
CONTENT = [
    Parameter('protocol'),
    Parameter('datatype'),
    Parameter('datascope'),
    Parameter('uri'),
    Parameter('autoconnect', Parameter.bool, False),
    Parameter('autoreconnect', Parameter.bool, True),
    Parameter('timeout', int, 30)
]


class MetaMiddleware(MetaConfigurable):
    MIDDLEWARES = {}

    def __init__(self, name, bases, attrs):
        super(MetaMiddleware, self).__init__(name, bases, attrs)

        mset = MetaMiddleware.MIDDLEWARES

        if self.__protocol__ not in mset:
            mset[self.__protocol__] = {}

        if self.__datatype__ not in mset[self.__protocol__]:
            mset[self.__protocol__][self.__datatype__] = []

        if self not in mset[self.__protocol__][self.__datatype__]:
            mset[self.__protocol__][self.__datatype__].append(self)


@conf_paths(CONF_PATH)
@add_category(CATEGORY, content=CONTENT)
class Middleware(Configurable):

    __metaclass__ = MetaMiddleware
    __protocol__ = 'middleware'
    __datatype__ = 'default'
    __datascope__ = 'default'

    class Error(Exception):
        def __init__(self):
            super(Middleware.Error, self).__init__(self.msg)

    class ConnectionError(Error):
        def __init__(self):
            self.msg = 'Impossible to connect'

            super(Middleware.ConnectionError, self).__init__()

    @staticmethod
    def get_by_uri(uri):
        mset = MetaMiddleware.MIDDLEWARES

        purl = urlparse(uri)
        protocol = purl.scheme or Middleware.__protocol__
        datatype = purl.path or Middleware.__datascope__
        datascope = purl.hostname or Middleware.__datatype__
        kwargs = parse_qs(purl.query)

        cls = mset.get(protocol, {}).get(datatype, Middleware)

        return cls(datascope=datascope, **kwargs)

    @property
    def protocol(self):
        if not hasattr(self, '_protocol'):
            self.protocol = None

        return self._protocol

    @protocol.setter
    def protocol(self, value):
        if value is None:
            value = type(self).__protocol__

        self._protocol = value

    @property
    def datatype(self):
        if not hasattr(self, '_datatype'):
            self.datatype = None

        return self._datatype

    @datatype.setter
    def datatype(self, value):
        if value is None:
            value = type(self).__datatype__

        self._datatype = value

    @property
    def datascope(self):
        if not hasattr(self, '_datascope'):
            self.datascope = None

        return self._datascope

    @datascope.setter
    def datascope(self, value):
        if value is None:
            value = type(self).__datascope__

        self._datascope = value

    def __init__(
        self,
        protocol=None,
        datatype=None,
        datascope=None,
        uri=None,
        autoconnect=None,
        autoreconnect=None,
        timeout=None,
        *args, **kwargs
    ):
        super(Middleware, self).__init__(*args, **kwargs)

        if protocol is not None:
            self.protocol = protocol

        if datatype is not None:
            self.datatype = datatype

        if datascope is not None:
            self.datascope = datascope

        if uri is not None:
            self.uri = uri

        if autoconnect is not None:
            self.autoconnect = autoconnect

        if autoreconnect is not None:
            self.autoreconnect = autoreconnect

        if timeout is not None:
            self.timeout = timeout

        if self.autoconnect:
            self.connect()

    @property
    def conn(self):
        if not hasattr(self, '_conn'):
            self.conn = None

        return self._conn

    @conn.setter
    def conn(self, val):
        self._conn = val

    @conn.deleter
    def conn(self):
        self._conn = None

    def connect(self):
        conn = self._get_connection(self.uri)

        if conn is None:
            raise Middleware.ConnectionError()

        self.conn = conn

    def _get_connection(self, uri):
        raise NotImplementedError()

    def isconnected(self):
        return self.conn is not None and self._is_connection_alive(self.conn)

    def _is_connection_alive(self, conn):
        raise NotImplementedError()

    def disconnect(self):
        self._deinit_connection(self.conn)
        del self.conn

    def _deinit_connection(self, conn):
        raise NotImplementedError()
