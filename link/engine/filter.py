# -*- utf-8 -*-

from b3j0f.utils.path import lookup
import re


def event_processing(engine, message, route, **kwargs):
    filters = engine['filters']

    for _filter in filters:
        rkregex = re.compile(_filter['route'])
        msgfilter = lookup(_filter['message'])
        task = lookup(_filter['task'])

        if rkregex.match(route) and msgfilter(message):
            result = task(message, route)

            if result is None:
                return

            message, route = result

    publisher = engine['publisher']
    publisher.publish(message, route)
