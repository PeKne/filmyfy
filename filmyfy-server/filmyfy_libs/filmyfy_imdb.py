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

        for g in data['genres']:
            genres.append(g['name'])

        result = {  # TODO: add other details we are interested in
            "id": str(movie_id),
            "title": data['original_title'],
            "plot": data["overview"],
            "genres": genres,
            "rating": data["vote_average"],
            'cover url':"http://image.tmdb.org/t/p/w185/"+data['poster_path']
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
            genres = []
            for g in d['genre_ids']:
                genres.append(self.genres_list[g])
            movie ={'id':d['id'],
                    'title': d['title'],
                    'plot':d['overview'],
                    'rating':d['vote_average'],
                    'cover url':"http://image.tmdb.org/t/p/w185/"+ ("/inVq3FRqcYIRl2la8iZikYYxFNR.jpg"
                    if d['poster_path'] is None else d['poster_path']),
                    'genres':genres}
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
            genres = []
            for g in d['genre_ids']:
                genres.append(self.genres_list[g])
            movie ={'id':d['id'],
                    'title': d['title'],
                    'plot':d['overview'],
                    'rating':d['vote_average'],
                    'cover url':"http://image.tmdb.org/t/p/w185/"+ ("/inVq3FRqcYIRl2la8iZikYYxFNR.jpg"
                    if d['poster_path'] is None else d['poster_path']),
                    'genres':genres}
            result.append(movie)

        return result

    def convert_to_tmdb_id(self, imdb_id):
        """
                Converts imbd id to tmbd id.
                :param imdb_id: integer identifying movie from IMDB
                :return: id of movie from TMDB
        """
        params = {'language':'en-US',
                  'api_key':"4de51198adff202147f63d73e4963ee2",
                  'external_source':'imdb_id'}

        url = "https://api.themoviedb.org/3/find/tt"+imdb_id

        r = requests.get(url = url,params=params)
        return r.json()['movie_results'][0]['id']

    def convert_to_imdb_id(self, tmdb_id):
        """
                Converts tmdb id to imdb id.
                :param imdb_id: integer identifying movie from TMDB
                :return: id of movie from IMDB
        """
        params = {'api_key':"4de51198adff202147f63d73e4963ee2"}
        url = "https://api.themoviedb.org/3/movie/"+str(tmdb_id)+"/external_ids"
        r = requests.get(url = url,params=params)
        return r.json()['imdb_id'][2:]

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