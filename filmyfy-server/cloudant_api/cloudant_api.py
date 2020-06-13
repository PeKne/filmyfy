import atexit
import json
import os
from cloudant import Cloudant
from flask import jsonify


class CloudantApi:
    db_name = 'users'
    client = None
    user_db = None

    def __init__(self):
        self.init_client()

    def init_client(self):

        # credentials from ENV variables - not sure if needed
        if 'VCAP_SERVICES' in os.environ:
            vcap = json.loads(os.getenv('VCAP_SERVICES'))
            print('Found VCAP_SERVICES')
            if 'cloudantNoSQLDB' in vcap:
                creds = vcap['cloudantNoSQLDB'][0]['credentials']
                user = creds['username']
                password = creds['password']
                url = 'https://' + creds['host']
                self.client = Cloudant(user, password, url=url, connect=True)

        # credentials from ENV variables for usage on IBM cloud
        elif "CLOUDANT_URL" in os.environ:
            self.client = Cloudant(os.environ['CLOUDANT_USERNAME'], os.environ['CLOUDANT_PASSWORD'], url=os.environ['CLOUDANT_URL'], connect=True)

        # credentials from local file
        elif os.path.isfile('vcap-local.json'):
            with open('vcap-local.json') as f:
                vcap = json.load(f)
                print('Found local VCAP_SERVICES')
                creds = vcap['services']['cloudantNoSQLDB'][0]['credentials']
                user = creds['username']
                password = creds['password']
                url = 'https://' + creds['host']
                self.client = Cloudant(user, password, url=url, connect=True)

        else:
            raise Exception("No CB credentials found")

        self.user_db = self.client.create_database(self.db_name, throw_on_exists=False)

    def disconnect(self):
        if self.client:
            self.client.disconnect()

    def get_user(self, nickname):
        if nickname in self.user_db:
            return jsonify(self.user_db[nickname])
        else:
            print('No user with nickname ', nickname, 'exists')
            return jsonify([])

    def get_users(self):
        return jsonify(list(self.user_db))

    def create_user(self, nickname, password):
        data = {
            '_id': nickname,
            'password': password,
            'seenMovies': [],
            'favouriteMovies': []
        }
        doc = self.user_db.create_document(data)
        data['_id'] = doc['_id']
        return jsonify(data)

    def add_seen_movie(self, nickname, movie):
        if nickname in self.user_db:
            user = self.user_db[nickname]
            user['seenMovies'].append(movie)
            user.save()
            return jsonify(user['seenMovies'])
        else:
            print('No user with nickname ', nickname, 'exists')
            return jsonify([])

    def get_user_seen_movies(self, nickname):
        if nickname in self.user_db:
            return jsonify(self.user_db[nickname]['seenMovies'])
        else:
            print('No user with nickname ', nickname, 'exists')
            return jsonify([])

    def add_favourite_movie(self, nickname, movie):
        if nickname in self.user_db:
            user = self.user_db[nickname]
            user['favouriteMovies'].append(movie)
            user.save()
            return jsonify(user['favouriteMovies'])
        else:
            print('No user with nickname ', nickname, 'exists')
            return jsonify([])

    def get_user_favourite_movies(self, nickname):
        if nickname in self.user_db:
            return jsonify(self.user_db[nickname]['favouriteMovies'])
        else:
            print('No user with nickname ', nickname, 'exists')
            return jsonify([])