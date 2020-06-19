import atexit
import json
import os
from cloudant import Cloudant
from flask import jsonify


class CloudantApi:
    db_name = 'users'
    client = None  # client for work with cloudant db
    user_db = None  # represents table, only one table is required for the purpose of this app

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

    def get_user(self, username):
        """
        Retrieves specific user by username

        :param username: string with user's username
        :return:
        """
        if username in self.user_db:
            return self.user_db[username]
        else:
            print('No user with username ', username, 'exists')
            return None

    def get_users(self):
        """
        Retrieves all users

        :return: json list of users
        """
        return jsonify(list(self.user_db))

    def create_user(self, username, password):
        """
        Creates a user with unique username and password

        :param username: unique string characterizing user
        :param password: password string
        :return: json with created user
        """
        data = {
            '_id': username,
            'password': password,
            'seenMovies': [],
            'favouriteMovies': []
        }
        doc = self.user_db.create_document(data)
        data['_id'] = doc['_id']
        return data

    def delete_user(self, username):
        """
        Deletes a user with username
        """
        if username in self.user_db:
            doc = self.user_db[username]
            doc.delete()
            return username
        return []

    def add_seen_movie(self, username, movie):
        if username in self.user_db:
            user = self.user_db[username]
            user['seenMovies'].append(movie)
            user.save()
            return user['seenMovies']
        else:
            print('No user with username ', username, 'exists')
            return []

    def get_user_seen_movies(self, username):
        if username in self.user_db:
            return self.user_db[username]['seenMovies']
        else:
            print('No user with username ', username, 'exists')
            return []

    def add_favourite_movie(self, username, movie_id):
        """
        Add a movie to the list of user's favourite movies

        :param username: username of the user
        :param movie_id: movie title
        :return: json list of movie titles
        """
        if username in self.user_db:
            user = self.user_db[username]
            user['favouriteMovies'].append(movie_id)
            user.save()
            return user['favouriteMovies']
        else:
            print('No user with username ', username, 'exists')
            return []

    def remove_favourite_movie(self, username, movie_id):
        """
        Removes a movie from the list of user's favourite movies

        :param username: username of the user
        :param movie_id: movie title
        :return: json list of movie titles
        """
        if username in self.user_db:
            user = self.user_db[username]
            try:
                user['favouriteMovies'].remove(movie_id)
            except:
                print("No such movie in favourites")
                return []
            user.save()
            return user['favouriteMovies']
        else:
            print('No user with username ', username, 'exists')
            return []

    def get_user_favourite_movies(self, username):
        """
        Retrieves user's favourite movies

        :param username: username of the user
        :return: json list of movie titles
        """
        if username in self.user_db:
            return self.user_db[username]['favouriteMovies']
        else:
            print('No user with username ', username, 'exists')
            return []

    def disconnect(self):
        if self.client:
            self.client.disconnect()