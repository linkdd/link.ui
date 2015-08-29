# -*- coding: utf-8 -*-

from __future__ import division

import numbers

try:
    import requests
except ImportError:
    requests = None

from jsonschema import _utils
from jsonschema.compat import str_types, int_types

from sqlalchemy import Table, Column, MetaData

_unset = _utils.Unset()

generators = {}
meta_schemas = _utils.URIDict()


def generates(version):
    def _generates(cls):
        generators[version] = cls
        if 'id' in cls.META_SCHEMA:
            meta_schemas[cls.META_SCHEMA['id']] = cls
        return cls
    return _generates


def create(meta_schema, generators=(), version=None, default_types=None):
    if default_types is None:
        default_types = {
            'array': list,
            'boolean': bool,
            'integer': int_types,
            'null': type(None),
            'number': numbers.Number,
            'object': dict,
            'string': str_types,
        }

    class Generator(object):
        GENERATORS = dict(generators)
        META_SCHEMA = dict(meta_schema)
        DEFAULT_TYPES = dict(default_types)

        def __init__(self, schema, resolver, *args, **kwargs):
            super(Generator, self).__init__(*args, **kwargs)

            self.schema = schema
            self.resolver = resolver
            self.metadata = MetaData()

        def __call__(self):
            return Table(
                self.schema.get('title', 'default').lower().replace(' ', '_'),
                self.metadata,
                *[column for column in self.iter_columns()]
            )

    if version is not None:
        Generator = generates(version)(Generator)
        Generator.__name__ = version.title().replace(' ', '') + 'Generator'

    return Generator


def extend(generator, generators, version=None):
    all_generators = dict(generator.VALIDATORS)
    all_generators.update(generators)
    return create(
        meta_schema=generator.META_SCHEMA,
        generators=all_generators,
        version=version,
        default_types=generator.DEFAULT_TYPES,
    )

_generators = None

Draft3Generator = create(
    meta_schema=_utils.load_schema('draft3'),
    generators={
        '$ref': _generators.ref,
        'additionalItems': _generators.additionalItems,
        'additionalProperties': _generators.additionalProperties,
        'dependencies': _generators.dependencies,
        'disallow': _generators.disallow_draft3,
        'divisibleBy': _generators.multipleOf,
        'enum': _generators.enum,
        'extends': _generators.extends_draft3,
        'format': _generators.format,
        'items': _generators.items,
        'maxItems': _generators.maxItems,
        'maxLength': _generators.maxLength,
        'maximum': _generators.maximum,
        'minItems': _generators.minItems,
        'minLength': _generators.minLength,
        'minimum': _generators.minimum,
        'multipleOf': _generators.multipleOf,
        'pattern': _generators.pattern,
        'patternProperties': _generators.patternProperties,
        'properties': _generators.properties_draft3,
        'type': _generators.type_draft3,
        'uniqueItems': _generators.uniqueItems,
    },
    version='draft3',
)

Draft4Generator = create(
    meta_schema=_utils.load_schema('draft4'),
    generators={
        '$ref': _generators.ref,
        'additionalItems': _generators.additionalItems,
        'additionalProperties': _generators.additionalProperties,
        'allOf': _generators.allOf_draft4,
        'anyOf': _generators.anyOf_draft4,
        'dependencies': _generators.dependencies,
        'enum': _generators.enum,
        'format': _generators.format,
        'items': _generators.items,
        'maxItems': _generators.maxItems,
        'maxLength': _generators.maxLength,
        'maxProperties': _generators.maxProperties_draft4,
        'maximum': _generators.maximum,
        'minItems': _generators.minItems,
        'minLength': _generators.minLength,
        'minProperties': _generators.minProperties_draft4,
        'minimum': _generators.minimum,
        'multipleOf': _generators.multipleOf,
        'not': _generators.not_draft4,
        'oneOf': _generators.oneOf_draft4,
        'pattern': _generators.pattern,
        'patternProperties': _generators.patternProperties,
        'properties': _generators.properties_draft4,
        'required': _generators.required_draft4,
        'type': _generators.type_draft4,
        'uniqueItems': _generators.uniqueItems,
    },
    version='draft4',
)


def generator_for(schema, default=_unset):
    if default is _unset:
        default = Draft4Generator
    return meta_schemas.get(schema.get('$schema', ''), default)


def create_table(instance, schema, cls=None, *args, **kwargs):
    if cls is None:
        cls = generator_for(schema)
    cls.check_schema(schema)
    return cls(schema, *args, **kwargs)()
