from imdb import IMDb
from imdb._exceptions import IMDbDataAccessError
import requests

class FilmyfyIMDB:
    """
    Our base class for communication with IMDb API.
    Main use cases: movie retrieving, filtering, getting movie metadata etc.

    In __init__ is initialized property `imdb` which is later used for communication with official IMDb API.
    """
    def __init__(self):
        self.imdb = IMDb(reraiseExceptions=True)

    def get_movie_metadata(self, movie_id):
        """
        Gets movie id and returns object with movie data. In case of un-existing ID returns None.
        :param movie_id: integer identifying movie
        :return: object with movie data
        """
        try:
            movie = self.imdb.get_movie(str(movie_id))
        except IMDbDataAccessError:  # unable to get movie
            return None

        result = {  # TODO: add other details we are interested in
            "id": str(movie_id),
            "cast": [(c.personID, c["name"]) for c in movie["cast"]],
            "plot": movie["plot"],
            "genres": movie["genres"],
            "rating": movie["rating"],
            "cover url": movie["cover url"],
            "keywords": self.imdb.get_movie_keywords(movie_id)['data']['keywords']
        }
        return result

    def find_movie(self, text_input):
        """
        Finds list of movies according to text.

        :param text_input: result will be based on this string value
        :return: list of movie IDs
        """

        movies = self.imdb.search_movie(text_input)
        return [m.movieID for m in movies]

    def find_similar_movies(self, movie_id):
        """
                Gets list of movie ids which are similar to the one (or more) from argument. Maximal list length is 100.
                :param movie_id: integer or list of integers identifying movies
                :return: list of movie IMDB IDs
        """
        params = {'language':'en-US',
                  'api_key':"4de51198adff202147f63d73e4963ee2",
                  'page':'1'}
        id = self.convert_to_tmdb_id(movie_id)
        url = "https://api.themoviedb.org/3/movie/"+str(id)+"/similar"
        r = requests.get(url = url,params=params)
        data = r.json()
        ids = []
        for d in data['results']:
            ids.append(self.convert_to_imdb_id(d['id']))

        return ids

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






