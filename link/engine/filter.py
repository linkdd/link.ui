# -*- utf-8 -*-

from b3j0f.utils.path import lookup
import re


def event_processing(engine, message, route, **kwargs):
    filters = engine['filters'].find()

    for filter in filters:
        rkregex = re.compile(filter['route'])
        msgfilter = lookup(filter['message'])
        task = lookup(filter['task'])

        if rkregex.match(route) and msgfilter(message):
            result = task(message, route)

            if result is None:
                return

            message, route = result

    publisher = engine['publisher']
    publisher.publish(message, route)
