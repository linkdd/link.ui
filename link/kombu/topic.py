# -*- utf-8 -*-

from link.kombu.base import Kombu
from b3j0f.conf.configurable.decorator import conf_paths, add_category


CONF_PATH = 'kombu/topic.conf'
CATEGORY = 'TOPIC'


@conf_paths(CONF_PATH)
@add_category(CATEGORY)
class KombuTopic(Kombu):

    __datatype__ = 'topic'
