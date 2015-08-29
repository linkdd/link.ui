# -*- utf-8 -*-

from link.rest.registry import ServiceRegistry

from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Parameter

from werkzeug.wsgi import DispatcherMiddleware
from flask import Flask, abort, send_file
import os


CONF_PATH = 'rest/server.conf'
CATEGORY = 'SERVER'
CONTENT = [
    Parameter('document_root')
]


@conf_paths(CONF_PATH)
@add_category(CATEGORY, content=CONTENT)
class WebServer(ServiceRegistry):

    @property
    def document_root(self):
        if not hasattr(self, '_document_root'):
            self.document_root = None

        return self._document_root

    @document_root.setter
    def document_root(self, value):
        if value is None:
            value = os.path.expanduser(os.path.join('~', 'public_html'))

        self._document_root = value

    def __init__(self, document_root=None, *args, **kwargs):
        super(WebServer, self).__init__(*args, **kwargs)

        if document_root is not None:
            self.document_root = document_root

        app = Flask(self.__class__.__name__)

        @app.route('/static/<path:path>')
        def cdn(path):
            abspath = os.path.expanduser(
                os.path.join(self.document_root, path)
            )

            if not os.path.exists(abspath):
                abort(404)

            return send_file(open(abspath))

        self.app = DispatcherMiddleware(app, {
            '/{0}'.format(self[sname].name): self[sname].app
            for sname in self
        })
