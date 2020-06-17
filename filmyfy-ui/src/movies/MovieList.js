import React, {useEffect, useState, useContext} from "react";
import {withRouter} from "react-router-dom";
import MovieThumbnail from './MovieThumbnail';
import SearchBar from './SearchBar';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";
import {UserContext} from "../App";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "80%",
    margin: "0 auto",
    textAlign: "left",
  }
}));

const MovieList = (userInfo) => {
  const classes = useStyles();
  const [movies, setMovies] = useState([]);
  const userContext = useContext(UserContext);


  useEffect(() => {
        const fetchData = async () => {
          fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/recommend/')
              .then((response) => response.json())
              .then((data) => {
                  setMovies(
                      data.map((m) => ({
                          id: m.id,
                          title: m.title,
                          genres: m.genres,
                          poster: m.poster,
                          rating: m.rating,
                      }))
                  );
              })
              .catch((err) => {
                  console.log('Error: ' + err);
              });
          // setMovies([{
          //   id: 1,
          //   title: "The Lord of The Rings",
          //   rating: 92,
          //   poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY999_CR0,0,673,999_AL_.jpg",
          //   genres: ["Fantasy", "Drama"]
          // },
          //   {
          //     id: 1,
          //     title: "Shawshank Redemption",
          //     rating: 86,
          //     poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
          //     genres: ["Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Pulp Fiction",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,686,1000_AL_.jpg",
          //     genres: ["Crime", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "The Lord of The Rings",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY999_CR0,0,673,999_AL_.jpg",
          //     genres: ["Fantasy", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Shawshank Redemption",
          //     rating: 86,
          //     poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
          //     genres: ["Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Pulp Fiction",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,686,1000_AL_.jpg",
          //     genres: ["Crime", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "The Lord of The Rings",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY999_CR0,0,673,999_AL_.jpg",
          //     genres: ["Fantasy", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Shawshank Redemption",
          //     rating: 86,
          //     poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
          //     genres: ["Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Pulp Fiction",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,686,1000_AL_.jpg",
          //     genres: ["Crime", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "The Lord of The Rings",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY999_CR0,0,673,999_AL_.jpg",
          //     genres: ["Fantasy", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Shawshank Redemption",
          //     rating: 86,
          //     poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
          //     genres: ["Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Pulp Fiction",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,686,1000_AL_.jpg",
          //     genres: ["Crime", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "The Lord of The Rings",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY999_CR0,0,673,999_AL_.jpg",
          //     genres: ["Fantasy", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Shawshank Redemption",
          //     rating: 86,
          //     poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
          //     genres: ["Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Pulp Fiction",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,686,1000_AL_.jpg",
          //     genres: ["Crime", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "The Lord of The Rings",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY999_CR0,0,673,999_AL_.jpg",
          //     genres: ["Fantasy", "Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Shawshank Redemption",
          //     rating: 86,
          //     poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
          //     genres: ["Drama"]
          //   },
          //   {
          //     id: 1,
          //     title: "Pulp Fiction",
          //     rating: 92,
          //     poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,686,1000_AL_.jpg",
          //     genres: ["Crime", "Drama"]
          //   },
          // ]);
        };
          fetchData();
        }, []);


  const MovieThumbnails = [];


  if (movies.length > 0) {
      for (let i in movies) {
          MovieThumbnails.push(
              <MovieThumbnail key={i} movie={movies[i]}/>
          );
      }
  }


  return (
    <div className={classes.wrapper}>
      <h1>Movies for you:</h1>
      {(movies.length > 0) && <SearchBar text="Haven't found what are you looking for? Search our database:"/>}
      {(movies.length <= 0) && <SearchBar text="To show your recommended movies, please add some to your favourites:"/>}
      <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
      >

        {MovieThumbnails}
      </Grid>
    </div>
  );
};

export default withRouter(MovieList);