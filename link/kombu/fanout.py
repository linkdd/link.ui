# -*- utf-8 -*-

from link.kombu.base import Kombu
from b3j0f.conf.configurable.decorator import conf_paths, add_category


CONF_PATH = 'kombu/fanout.conf'
CATEGORY = 'FANOUT'


@conf_paths(CONF_PATH)
@add_category(CATEGORY)
class KombuFanout(Kombu):

    __datatype__ = 'fanout'
