# -*- utf-8 -*-

from link.bus.base import Bus
from b3j0f.conf.configurable.decorator import conf_paths, add_category

from kombu import Connection, Consumer, Exchange, Queue
from kombu.pools import producers


CONF_PATH = 'bus/kombu.conf'
CATEGORY = 'KOMBU'


@conf_paths(CONF_PATH)
@add_category(CATEGORY)
class Kombu(Bus):

    __protocol__ = 'kombu'

    class Error(Bus.Error):
        def __init__(self):
            super(Kombu.Error, self).__init__(self.msg)

    def __init__(self, *args, **kwargs):
        super(Kombu, self).__init__(*args, **kwargs)

        self._exchange = Exchange(
            self.datascope,
            type=self.datatype
        )

        self._queue = Queue(
            self.nodename,
            self._exchange,
            routing_key=self.subscribe
        )

    def _get_connection(self, uri):
        return Connection(uri)

    def _is_connection_alive(self, conn):
        return conn.connected

    def _deinit_connection(self, conn):
        conn.release()

    def _sendto(self, conn, msg, route):
        with producers[conn].acquire(block=True) as producer:
            producer.publish(
                msg,
                serializer='json',
                exchange=self._exchange,
                declare=[self._exchange],
                routing_key=route
            )

    def _receive(self, conn, callback, timeout=1):
        def handler(body, msg):
            callback(body, msg.delivery_info['routing_key'])

        consumer = Consumer(
            conn,
            [self._queue],
            accept=['json'],
            callbacks=[handler]
        )

        with consumer:
            conn.drain_events(timeout=timeout)
