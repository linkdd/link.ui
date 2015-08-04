# -*- utf-8 -*-

from b3j0f.conf.registry import ConfigurableRegistry
from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Configuration
from link.middleware.base import Middleware


CONF_PATH = 'middleware/registry.conf'
CATEGORY = 'LINKEDMANAGER'


class Middlewares(dict):
    def __init__(self, values=None, *args, **kwargs):
        super(Middlewares, self).__init__(*args, **kwargs)

        if values is not None:
            for name in values:
                self[name] = values[name]

    def __setitem__(self, name, value):
        middleware = value

        if isinstance(middleware, basestring):
            middleware = Middleware.get_by_uri(middleware)

        if isinstance(middleware, Middleware):
            super(Middlewares, self).__setitem__(name, middleware)


@conf_paths(CONF_PATH)
@add_category(CATEGORY)
class MiddlewareRegistry(ConfigurableRegistry):

    MIDDLEWARE_SUFFIX = '_uri'

    def __init__(self, middlewares=None, *args, **kwargs):
        super(MiddlewareRegistry, self).__init__(*args, **kwargs)

        self._middlewares = Middlewares(middlewares)

    def _configure(self, unified_conf, *args, **kwargs):
        super(MiddlewareRegistry, self)._configure(
            unified_conf=unified_conf,
            *args, **kwargs
        )

        foreigns = unified_conf[Configuration.FOREIGNS]

        if foreigns:
            # get len of suffix in order to extract sub middleware names
            lensuffix = len(MiddlewareRegistry.MIDDLEWARE_SUFFIX)

            for param in foreigns:
                if param.name.endswith(MiddlewareRegistry.MIDDLEWARE_SUFFIX):
                    name = param.name[:-lensuffix]

                    self._middlewares[name] = param.value

    def __contains__(self, name):
        ret = super(MiddlewareRegistry, self).__contains__(name)

        if not ret and name in self._middlewares:
            ret = True

        return ret

    def __getitem__(self, name):
        if name in self._middlewares:
            return self._middlewares[name]

        else:
            return super(MiddlewareRegistry, self).__getitem__(name)

    def __setitem__(self, name, value):
        if name in self._middlewares:
            self._middlewares[name] = value

        else:
            return super(MiddlewareRegistry, self).__setitem__(name, value)
