import atexit
import os
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from cloudant_api.cloudant_api import CloudantApi
from filmyfy_libs.filmyfy_imdb import FilmyfyIMDB
from utils import authentication

app = Flask(__name__, static_url_path='')
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# On IBM Cloud Cloud Foundry, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8000
port = int(os.getenv('PORT', 8000))
cloudantApi = None
imdbApi = None

#  API documentation: https://filmify.docs.apiary.io

# register new user
@app.route('/api/user/register/', methods=['POST'])
def register_user():
    nickname = request.json['username']
    password_hash = authentication.hash_password(request.json['password'])
    return cloudantApi.create_user(nickname, password_hash)

# login user
@app.route('/api/user/login/', methods=['POST', 'OPTIONS'])
@cross_origin()
def login_user():
    nickname = request.json['username']
    entered_password = request.json['password']

    user = cloudantApi.get_user(nickname)
    if not user:
        return ""

    stored_password = user['password']

    if authentication.verify_password(stored_password, entered_password):
        response = jsonify(nickname)
        return response
    else:
        return ""

# delete user account
@app.route('/api/user/<username>/', methods=['DELETE'])
def remove_user(username):
    return jsonify(cloudantApi.delete_user(username))

# find a movie by text string
@app.route('/api/movie/find/<text>/', methods=['GET'])
def find_movies(text):
    ids = imdbApi.find_movie(text)
    movies = []
    for id in ids:
        data = imdbApi.get_movie_metadata(id)
        if data:
            movies.append(data)
    return jsonify(movies)

# find a movie by id
@app.route('/api/movie/<movie_id>/', methods=['GET'])
def get_movie(movie_id):
    return jsonify(imdbApi.get_movie_metadata(movie_id))

# find similar movies to the one identified by movie_id
@app.route('/api/movie/similar/<movie_id>/', methods=['GET'])
def list_similar_movies(movie_id):
    return jsonify(imdbApi.find_similar_movies(movie_id))

# recommend movies according to user profile history
@app.route('/api/user/<username>/recommend/', methods=['GET'])
def recommend_by_profile(username):
    # TODO add logic to recommendation
    ids = cloudantApi.get_user_favourite_movies(username)
    movies = []
    for id in ids:
        movie_data = imdbApi.get_movie_metadata(id)
        if movie_data:
            movies.append(movie_data)
    return jsonify(movies)

# get user's favourite movies
@app.route('/api/user/<username>/favourite/', methods=['GET'])
def get_favourite_movies(username):
    ids = cloudantApi.get_user_favourite_movies(username)
    movies = []
    for id in ids:
        movie_data = imdbApi.get_movie_metadata(id)
        if movie_data:
            movies.append(movie_data)
    return jsonify(movies)

# add movie/actor/director/category to favourites
@app.route('/api/user/<username>/favourite/<movie_id>/', methods=['POST'])
def add_to_favourites(username, movie_id):
    return jsonify(cloudantApi.add_favourite_movie(username, movie_id))

# remove movie/actor/director/category from favourites
@app.route('/api/user/<username>/favourite/<movie_id>/', methods=['DELETE'])
def remove_from_favourites(username, movie_id):
    return jsonify(cloudantApi.remove_favourite_movie(username, movie_id))


@atexit.register
def on_exit():
    cloudantApi.disconnect()


if __name__ == '__main__':
    cloudantApi = CloudantApi()
    imdbApi = FilmyfyIMDB()

    app.run(host='0.0.0.0', port=port, debug=True)
