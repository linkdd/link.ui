# -*- utf-8 -*-

from b3j0f.conf.registry import ConfigurableRegistry
from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Configuration
from b3j0f.utils.path import lookup
from link.rest.service import Service


CONF_PATH = 'rest/registry.conf'
CATEGORY = 'SERVICE_REGISTRY'


class Services(dict):
    def __init__(self, values=None, *args, **kwargs):
        super(Services, self).__init__(*args, **kwargs)

        if values is not None:
            for name in values:
                self[name] = values[name]

    def __setitem__(self, name, value):
        service = value

        if isinstance(service, basestring):
            servicecls = lookup(service)
            service = servicecls()

        if isinstance(service, Service):
            super(Services, self).__setitem__(name, service)


@conf_paths(CONF_PATH)
@add_category(CATEGORY)
class ServiceRegistry(ConfigurableRegistry):

    SERVICE_SUFFIX = '_service'

    def __init__(self, services=None, *args, **kwargs):
        super(ServiceRegistry, self).__init__(*args, **kwargs)

        self._services = Services(services)

    def _configure(self, unified_conf, *args, **kwargs):
        super(ServiceRegistry, self)._configure(
            unified_conf=unified_conf,
            *args, **kwargs
        )

        foreigns = unified_conf[Configuration.FOREIGNS]

        if foreigns:
            # get len of suffix in order to extract sub service names
            lensuffix = len(ServiceRegistry.SERVICE_SUFFIX)

            for param in foreigns:
                if param.name.endswith(ServiceRegistry.SERVICE_SUFFIX):
                    name = param.name[:-lensuffix]

                    self._services[name] = param.value

    def __contains__(self, name):
        ret = super(ServiceRegistry, self).__contains__(name)

        if not ret and name in self._services:
            ret = True

        return ret

    def __getitem__(self, name):
        if name in self._services:
            return self._services[name]

        else:
            return super(ServiceRegistry, self).__getitem__(name)

    def __setitem__(self, name, value):
        if name in self._services:
            self._services[name] = value

        else:
            return super(ServiceRegistry, self).__setitem__(name, value)

    def __iter__(self):
        return iter(self._services)
