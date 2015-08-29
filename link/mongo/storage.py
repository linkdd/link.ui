# -*- utf-8 -*-

from link.data.storage import Storage
from b3j0f.conf.configurable.decorator import conf_paths, add_category
from b3j0f.utils.iterable import isiterable
from pymongo import MongoClient


CONF_PATH = 'storage/mongo.conf'
CATEGORY = 'MONGO'


@conf_paths(CONF_PATH)
@add_category(CATEGORY)
class Mongo(Storage):

    __protocol__ = 'mongo'

    def _get_connection(self, uri):
        return MongoClient(uri)

    def _is_connection_alive(self, conn):
        return True

    def _deinit_connection(self, conn):
        conn.close()

    @property
    def _database(self):
        return self.conn[self.db]

    @property
    def _collection(self):
        return self._database[self.__datatype__]

    @staticmethod
    def get_mongo_filter(filter):
        mfilter = {'$and': []}

        for key in filter:
            if isiterable(filter[key], exclude=str):
                mfilter['$and'].append({'$or': [
                    {key: value}
                    for value in filter[key]
                ]})

            else:
                mfilter['$and'].append({key: filter[key]})

        return mfilter

    @staticmethod
    def get_mongo_batch(batch):
        mbatch = {}

        for key in batch:
            if batch[key] is None:
                if '$unset' not in mbatch:
                    mbatch['$unset'] = {}

                mbatch['$unset'][key] = 1

            elif isiterable(batch[key], exclude=(dict, str)):
                if '$push' not in mbatch:
                    mbatch['$push'] = {}

                mbatch['$push'][key] = {'$each': batch[key]}

            else:
                if '$set' not in mbatch:
                    mbatch['$set'] = {}

                mbatch['$set'][key] = batch[key]

        return mbatch

    def find(self, filter):
        mfilter = self.get_mongo_filter(filter)
        return self._collection.find(mfilter)

    def insert(self, records):
        if isiterable(records, exclude=dict):
            ids = self._collection.insert_many(records).inserted_ids

            for i in range(len(records)):
                records[i]['id'] = ids[i]

        else:
            _id = self._collection.insert_one(records).inserted_id
            records['id'] = _id

        return records

    def save(self, records):
        if isiterable(records, exclude=dict):
            for record in records:
                record['_id'] = record.pop('id')

        else:
            records['_id'] = records.pop('id')

        return self.insert(records)

    def update(self, filter, batch):
        self._collection.update_many(
            self.get_mongo_filter(filter),
            self.get_mongo_batch(batch)
        )

    def delete(self, filter):
        mfilter = self.get_mongo_filter(filter)
        self._collection.delete_many(mfilter)
