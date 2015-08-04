# -*- utf-8 -*-

from link.middleware.base import Middleware
from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Parameter


CONF_PATH = 'middleware/bus.conf'
CATEGORY = 'BUS'
CONTENT = [
    Parameter('nodename'),
    Parameter('subscribe')
]


@conf_paths(CONF_PATH)
@add_category(CATEGORY, content=CONTENT)
class Bus(Middleware):

    __protocol__ = 'bus'

    class Error(Middleware.Error):
        def __init__(self):
            super(Bus.Error, self).__init__(self.msg)

    def __init__(
        self,
        nodename=None,
        subscribe=None,
        *args, **kwargs
    ):
        super(Bus, self).__init__(*args, **kwargs)

        if nodename is not None:
            self.nodename = nodename

        if subscribe is not None:
            self.subscribe = subscribe

    def publish(self, msg, route):
        self._sendto(self.conn, route, msg)

    def _sendto(self, conn, msg, route):
        raise NotImplementedError()

    def listen(self, callback):
        while self.autoreconnect:
            ntimeout = 0

            while self.isconnected():
                try:
                    self._receive(self.conn, callback, timeout=0.5)

                except Bus.Timeout:
                    ntimeout += 1

                    if (ntimeout * 0.5) >= self.timeout:
                        self.disconnect()

            self.connect()

    def _receive(self, conn, callback, timeout=None):
        raise NotImplementedError()
