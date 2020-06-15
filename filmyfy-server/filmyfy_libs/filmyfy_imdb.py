from imdb import IMDb
from imdb._exceptions import IMDbDataAccessError


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
                :return: list of movie IDs
        """
        movie_metadata = self.get_movie_metadata(movie_id)
        keyword_movies_list = []
        top_250 = self.imdb.get_top250_movies()

        return keyword_movies_list





