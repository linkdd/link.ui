# -*- utf-8 -*-

from b3j0f.conf.configurable.registry import ConfigurableRegistry
from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Parameter

from flask import Flask, request, abort
import json


CONF_PATH = 'rest/service.conf'
CATEGORY = 'SERVICE'
CONTENT = [
    Parameter('name')
]


@conf_paths(CONF_PATH)
@add_category(CATEGORY, content=CONTENT)
class Service(ConfigurableRegistry):

    MANAGER = 'manager'

    @property
    def name(self):
        if not hasattr(self, '_name'):
            self.name = None

        return self._name

    @name.setter
    def name(self, value):
        if value is None:
            value = __name__

        self._name = value

    def __init__(self, name=None, *args, **kwargs):
        super(Service, self).__init__(*args, **kwargs)

        if name is not None:
            self.name = name

        self.app = Flask(self.name)

        @self.app.route('/<path:path>')
        def wrapper(path):
            self.logger.info('Request: %s /%s', request.method, path)

            try:
                manager = self[Service.MANAGER]
                args = path.split('/')
                kwargs = dict(request.args)
                data = None if not request.data else json.loads(request.data)

                methodmap = {
                    'POST': manager.create,
                    'GET': manager.read,
                    'PUT': manager.update,
                    'DELETE': manager.delete
                }

                result = methodmap[request.method](body=data, *args, **kwargs)
                result = json.dumps(result)

                self.logger.debug('Response: %s', result)

                return result

            except NotImplementedError as err:
                self.logger.error('Error: %r', err, exc_info=True)
                abort(501)

            except Exception as err:
                self.logger.error('Error: %r', err, exc_info=True)
                abort(500)
