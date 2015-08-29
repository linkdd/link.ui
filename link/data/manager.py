# -*- utf-8 -*-

from link.middleware.registry import MiddlewareRegistry
from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.conf.params import Parameter
from b3j0f.utils.path import lookup


CONF_PATH = 'data/manager.conf'
CATEGORY = 'MANAGER'
CONTENT = [
    Parameter('create_task'),
    Parameter('read_task'),
    Parameter('update_task'),
    Parameter('delete_task')
]


@conf_paths(CONF_PATH)
@add_category(CATEGORY, content=CONTENT)
class Manager(MiddlewareRegistry):

    STORAGE = 'storage'

    __cache__ = {}

    @classmethod
    def get(cls, name, conf_path=None, content=None, *args, **kwargs):
        if name not in cls.__cache__:
            newcls = type(name, (cls,), {})

            catdecorator = add_category(name.upper(), content=content)
            newcls = catdecorator(newcls)

            if conf_path is not None:
                confdecorator = conf_paths(conf_path)
                newcls = confdecorator(newcls)

        else:
            newcls = cls.__cache__[name]

        return newcls(*args, **kwargs)

    @property
    def create_task(self):
        if not hasattr(self, '_create_task'):
            self.create_task = None

        return self._create_task

    @create_task.setter
    def create_task(self, value):
        if value is None:
            value = create_task

        else:
            value = lookup(value)

        self._create_task = value

    @property
    def read_task(self):
        if not hasattr(self, '_read_task'):
            self.read_task = None

        return self._read_task

    @read_task.setter
    def read_task(self, value):
        if value is None:
            value = read_task

        else:
            value = lookup(value)

        self._read_task = value

    @property
    def update_task(self):
        if not hasattr(self, '_update_task'):
            self.update_task = None

        return self._update_task

    @update_task.setter
    def update_task(self, value):
        if value is None:
            value = update_task

        else:
            value = lookup(value)

        self._update_task = value

    @property
    def delete_task(self):
        if not hasattr(self, '_delete_task'):
            self.delete_task = None

        return self._delete_task

    @delete_task.setter
    def delete_task(self, value):
        if value is None:
            value = delete_task

        else:
            value = lookup(value)

        self._delete_task = value

    def __init__(
        self,
        create_task=None,
        read_task=None,
        update_task=None,
        delete_task=None,
        *args, **kwargs
    ):
        super(Manager, self).__init__(*args, **kwargs)

        if create_task is not None:
            self.create_task = create_task

        if read_task is not None:
            self.read_task = read_task

        if update_task is not None:
            self.update_task = update_task

        if delete_task is not None:
            self.delete_task = delete_task

    def create(self, *args, **kwargs):
        return self.create_task(self, *args, **kwargs)

    def read(self, *args, **kwargs):
        return self.read_task(self, *args, **kwargs)

    def update(self, *args, **kwargs):
        return self.update_task(self, *args, **kwargs)

    def delete(self, *args, **kwargs):
        return self.delete_task(self, *args, **kwargs)


def create_task(manager, *args, **kwargs):
    manager.logger.error('Create not implemented')
    return None


def read_task(manager, *args, **kwargs):
    manager.logger.error('Read not implemented')
    return None


def update_task(manager, *args, **kwargs):
    manager.logger.error('Update not implemented')
    return None


def delete_task(manager, *args, **kwargs):
    manager.logger.error('Delete not implemented')
    return None
