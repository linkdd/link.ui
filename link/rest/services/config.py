# -*- coding: utf-8 -*-

from link.data.manager import Manager as BaseManager
from b3j0f.conf.configurable.decorator import conf_paths, add_category

import json


CONF_PATH = 'rest/services/config.conf'
CATEGORY = 'CONFIG'


@conf_paths(CONF_PATH)
@add_category(CATEGORY)
class Manager(BaseManager):
    def __init__(self, *args, **kwargs):
        super(Manager, self).__init__(*args, **kwargs)


def create_task(manager, name, body=None):
    if body is None:
        return {
            'success': False,
            'message': 'Missing body'
        }, 400

    body['id'] = name
    manager[BaseManager.STORAGE].save(body)

    return {
        'success': True
    }, 200


def read_task(manager, name, body=None):
    result = manager[BaseManager.STORAGE].find({'id': name})

    if not result:
        return {
            'success': False,
            'message': 'Not found'
        }, 404

    return {
        'success': True,
        'data': list(result)
    }, 200


def update_task(manager, name=None, filter=None, body=None):
    if body is None:
        return {
            'success': False,
            'message': 'Missing body'
        }, 400

    if name is not None:
        body['id'] = name
        manager[BaseManager.STORAGE].save(body)

    elif filter is not None:
        manager[BaseManager.STORAGE].update(json.loads(filter), body)

    else:
        return {
            'success': False,
            'message': 'Missing filter'
        }, 400

    return {
        'success': True
    }, 200


def delete_task(manager, name, body=None):
    manager[BaseManager.STORAGE].delete({'id': name})

    return {
        'success': True
    }, 200
