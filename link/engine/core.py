# -*- utf-8 -*-

from link.middleware.registry import MiddlewareRegistry

from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Parameter
from b3j0f.utils.iterable import first
from b3j0f.utils.path import lookup

from threading import Thread
from time import sleep


CONF_PATH = 'engines/engine.conf'
CATEGORY = 'ENGINE'
CONTENT = [
    Parameter('event_processing'),
    Parameter('daemon_processing'),
]


@conf_paths(CONF_PATH)
@add_category(CATEGORY, content=CONTENT)
class Engine(MiddlewareRegistry):

    QUEUE = 'queue'

    @staticmethod
    def new(name, members=None):
        confpath = 'engines/{0}'.format(name)

        decorator = conf_paths(confpath)

        if members is None:
            members = {}

        return decorator(type(name, (Engine,), members))

    @property
    def event_processing(self):
        if not hasattr(self, '_event_processing'):
            self.event_processing = None

        return self._event_processing

    @event_processing.setter
    def event_processing(self, val):
        if val is None:
            val = event_processing

        elif not callable(val):
            val = lookup(val)

        self._event_processing = val

    @property
    def daemon_processing(self):
        if not hasattr(self, '_daemon_processing'):
            self.daemon_processing = None

        return self._daemon_processing

    @daemon_processing.setter
    def daemon_processing(self, val):
        if val is None:
            val = daemon_processing

        elif not callable(val):
            val = lookup(val)

        self._daemon_processing = val

    def __init__(
        self,
        queue=None,
        event_processing=None,
        daemon_processing=None,
        *args, **kwargs
    ):
        super(Engine, self).__init__(*args, **kwargs)

        if queue is not None:
            self[Engine.QUEUE] = queue

        if event_processing is not None:
            self.event_processing = event_processing

        if daemon_processing is not None:
            self.daemon_processing = daemon_processing

    def __call__(self):
        queue = self[Engine.QUEUE]

        queue.connect()

        thread = Thread(target=queue.listen, args=(self.work,))
        thread.start()

        running = True

        while running:
            running = self.daemon_processing(self)

        thread.terminate()
        thread.join()

        queue.disconnect()

    def work(self, msg, rk):
        result = self.event_processing(self, msg, rk)

        if result is not None:
            msg, rk = result

        self.chain_message(msg, rk)

    def chain_message(self, msg, rk):
        queue = self[Engine.QUEUE]
        rk = first(rk.split('.', 1)[1:])

        if rk:
            queue.publish(msg, rk)


def event_processing(engine, message, route, **kwargs):
    pass


def daemon_processing(engine, **kwargs):
    try:
        sleep(1)

    except KeyboardInterrupt:
        return False

    return True
