from imdb import IMDb
import requests

class FilmyfyIMDB:
    """
    Our base class for communication with TMDB API.
    Main use cases: movie retrieving, filtering, getting movie metadata etc.

    In __init__ is initialized property `imdb` which is later used for communication with official IMDb API.
    """
    def __init__(self):
        self.imdb = IMDb(reraiseExceptions=True)
        self.genres_list = self.init_genres()

    def init_genres(self):
        params = {'api_key':"4de51198adff202147f63d73e4963ee2",
                  'language':'en-US',}

        url = "https://api.themoviedb.org/3/genre/movie/list"
        r = requests.get(url = url,params=params)
        data = r.json()
        result = {}
        for d in data['genres']:
            result[d['id']] = d['name']

        return result

    def get_movie_metadata(self, movie_id):
        """
        Gets movie id and returns object with movie data. In case of un-existing ID returns None.
        :param movie_id: integer identifying movie
        :return: object with movie data
        """
        params = {'api_key':"4de51198adff202147f63d73e4963ee2",
                  'language':'en-US',}

        url = "https://api.themoviedb.org/3/movie/"+str(movie_id)
        r = requests.get(url = url,params=params)
        data = r.json()
        genres = []

        if not all(k in data for k in ['original_title', 'overview', 'genres', 'vote_average']):
            return {}

        for g in data['genres']:
            genres.append(g['name'])

        result = {  # TODO: add other details we are interested in
            'id': str(movie_id),
            'title': data['original_title'],
            'plot': data["overview"],
            'genres': genres,
            'rating': data["vote_average"],
            'poster':"http://image.tmdb.org/t/p/w185/"+ ("/inVq3FRqcYIRl2la8iZikYYxFNR.jpg"
                    if data['poster_path'] is None else data['poster_path'])
        }
        return result

    def find_movie(self, text_input):
        """
        Finds list of movies according to text.

        :param text_input: result will be based on this string value
        :return: dictionary, where key is Id of movie with value of dictionary containing movie data
        """
        params = {'query':text_input,
                  'api_key':"4de51198adff202147f63d73e4963ee2",
                  'include_adult':'false',
                  'language':'en-US',
                  'page':'1'}

        url = "https://api.themoviedb.org/3/search/movie"
        r = requests.get(url = url,params=params)
        data = r.json()
        result = []

        for d in data['results']:
            if not all(k in d for k in ['title', 'overview', 'genre_ids', 'vote_average']):
                return result
            genres = []
            for g in d['genre_ids']:
                genres.append(self.genres_list[g])
            movie = self.parse_movie_json(d, genres)
            result.append(movie)
        return result

    def find_similar_movies(self, movie_id):
        """
                Gets list of movie ids which are similar to the one (or more) from argument. Maximal list length is 100.
                :param movie_id: integer or list of integers identifying movies
                :return: dictionary, where key is Id of movie with value of dictionary containing movie data
        """
        params = {'language':'en-US',
                  'api_key':"4de51198adff202147f63d73e4963ee2",
                  'page':'1'}
        url = "https://api.themoviedb.org/3/movie/"+str(movie_id)+"/similar"
        r = requests.get(url = url,params=params)
        data = r.json()

        result = []

        for d in data['results']:
            if not all(k in d for k in ['title', 'overview', 'genre_ids', 'vote_average']):
                return result
            genres = []
            for g in d['genre_ids']:
                genres.append(self.genres_list[g])
            movie =self.parse_movie_json(d, genres)
            result.append(movie)

        return result

    def find_similar_movie_by_favourite(self, favourite_list_ids):
        recommended_movies_list = {}
        for f_id in favourite_list_ids:
            for d in self.find_similar_movies(f_id):
                if d['id'] in recommended_movies_list:
                    recommended_movies_list[d['id']] += 1
                else:
                    recommended_movies_list[d['id']] = 1

        sorted_list = sorted(recommended_movies_list.items(), key=lambda kv: -kv[1])
        result = []
        for key in sorted_list[:20]:
            result.append(self.get_movie_metadata(key[0]))
        return result

    def parse_movie_json(self, data, genres):
        movie = {'id':data['id'],
                    'title': data['title'],
                    'plot':data['overview'],
                    'rating':data['vote_average'],
                    'poster': "https://image.shutterstock.com/image-vector/cool-vector-web-banner-printable-260nw-257795440.jpg"
                    if data['poster_path'] is None else "http://image.tmdb.org/t/p/w185/"+data['poster_path'],
                    'genres':genres}
        return movie