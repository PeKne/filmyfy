from cloudant import Cloudant
from flask import Flask, request, jsonify
import atexit
import os
import json

app = Flask(__name__, static_url_path='')

db_name = 'mydb'
client = None
db = None

if 'VCAP_SERVICES' in os.environ:
    vcap = json.loads(os.getenv('VCAP_SERVICES'))
    print('Found VCAP_SERVICES')
    if 'cloudantNoSQLDB' in vcap:
        creds = vcap['cloudantNoSQLDB'][0]['credentials']
        user = creds['username']
        password = creds['password']
        url = 'https://' + creds['host']
        client = Cloudant(user, password, url=url, connect=True)
        db = client.create_database(db_name, throw_on_exists=False)
elif "CLOUDANT_URL" in os.environ:
    client = Cloudant(os.environ['CLOUDANT_USERNAME'], os.environ['CLOUDANT_PASSWORD'], url=os.environ['CLOUDANT_URL'], connect=True)
    db = client.create_database(db_name, throw_on_exists=False)
elif os.path.isfile('vcap-local.json'):
    with open('vcap-local.json') as f:
        vcap = json.load(f)
        print('Found local VCAP_SERVICES')
        creds = vcap['services']['cloudantNoSQLDB'][0]['credentials']
        user = creds['username']
        password = creds['password']
        url = 'https://' + creds['host']
        client = Cloudant(user, password, url=url, connect=True)
        db = client.create_database(db_name, throw_on_exists=False)

# On IBM Cloud Cloud Foundry, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8000
port = int(os.getenv('PORT', 8000))

@app.route('/')
def root():
    return app.send_static_file('index.html')

# /* Endpoint to greet and add a new visitor to database.
# * Send a POST request to localhost:8000/api/visitors with body
# * {
# *     "name": "Bob"
# * }
# */
@app.route('/api/visitors', methods=['GET'])
def get_visitor():
    if client:
        return jsonify(list(map(lambda doc: doc['name'], db)))
    else:
        print('No database')
        return jsonify([])

# /**
#  * Endpoint to get a JSON array of all the visitors in the database
#  * REST API example:
#  * <code>
#  * GET http://localhost:8000/api/visitors
#  * </code>
#  *
#  * Response:
#  * [ "Bob", "Jane" ]
#  * @return An array of all the visitor names
#  */
@app.route('/api/visitors', methods=['POST'])
def put_visitor():
    user = request.json['name']
    data = {'name':user}
    if client:
        my_document = db.create_document(data)
        data['_id'] = my_document['_id']
        return jsonify(data)
    else:
        print('No database')
        return jsonify(data)


@atexit.register
def shutdown():
    if client:
        client.disconnect()


#  API documentation: https://filmify.docs.apiary.io

# register new user
@app.route('/api/user/register/', methods=['POST'])
def register_user():
    pass

# login user
@app.route('/api/user/login/', methods=['POST'])
def login_user():
    pass

# delete user account
@app.route('/api/user/delete/', methods=['DELETE'])
def remove_user():
    pass

# find a movie by text string
@app.route('/api/movie/find/', methods=['POST'])
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
