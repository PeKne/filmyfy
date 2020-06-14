import atexit
import os

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from cloudant_api.cloudant_api import CloudantApi
from utils import authentication

app = Flask(__name__, static_url_path='')
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# On IBM Cloud Cloud Foundry, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8000
port = int(os.getenv('PORT', 8000))
cloudantApi = None

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
@app.route('/api/user/delete/', methods=['DELETE'])
def remove_user():
    pass

# find a movie by text string
@app.route('/api/movie/find/', methods=['GET'])
def find_movies():
    pass

# find similar movies to the one identified by movie_id
@app.route('/api/movie/similar/<movie_id>/', methods=['GET'])
def list_similar_movies():
    pass

# recommend movies according to user profile history
@app.route('/api/movie/recommend/<username>/', methods=['GET'])
def recommend_by_profile():
    pass

# return movies seen by user
@app.route('/api/movie/seen/<username>/', methods=['GET'])
def get_seen_movies():
    pass

# add movie/actor/director/category to favourites
@app.route('/api/favourite/add/', methods=['POST'])
def add_to_favourites():
    pass

# remove movie/actor/director/category from favourites
@app.route('/api/favourite/remove/', methods=['DELETE'])
def remove_from_favourites():
    pass


@atexit.register
def on_exit():
    cloudantApi.disconnect()


if __name__ == '__main__':
    cloudantApi = CloudantApi()

    app.run(host='0.0.0.0', port=port, debug=True)
