import React, {useEffect, useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {ArrowBack, AddCircleOutline} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";





const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: "3em",
    width: "70%",
    margin: "0 auto",
    height: "auto",
  },
  metadataWrapper: {
    marginTop: "1em",
    padding: "0 5%",
    textAlign: "justify",
  },
  buttonWrapper: {
    textAlign: "justify",
    paddingTop: "15px",
  },
  returnButton: {
    marginBottom: "0.3em",
    color: "#000"
  },

  addButton: {
    fontWeight: 800,
    color: "#72bb53",
    backgroundColor: "#fff",
    borderRadius: "1em",
    '&:hover': {
      backgroundColor: "#72bb53",
    color: "#fff",
    }
  },

  icon: {
    marginTop: "0.3em",
    padding: "0 0",
  },

  poster: {
    height: 0,
    paddingTop: '138%',

  },
  title:{
    margin: "0.2em 0",
  },
  rating: {
    color: "#ff641e",
    paddingLeft: "0.3em",
    fontWeight: "900",
  },
  genres:{
        fontWeight: "600",

    margin: "0.4em 0",
    display: "block",
  },

}));


function MovieDetail() {
  // const [movie, setMovie] = useState([]);
  const classes = useStyles();
  // useEffect(() => {  TODO: CREATE ENDPOINT FOR GETING MOVIE BY ID
  //       // const fetchData = async () => {
  //       //   fetch('http://localhost:8000/api/movie/recommend/' + userInfo.username + "/")
  //       //     .then((response) => response.json())
  //       //     .then((data) => {
  //       //       setMovies(
  //       //         data.map((m) => ({
  //       //           id: m.id,
  //       //           title: m.title,
  //       //           genres: m.genres,
  //       //           poster: m.poster,
  //       //           rating: m.rating,
  //       //         }))
  //       //       );
  //       //     })
  //       //     .catch((err) => {
  //       //       console.log('Error: ' + err);
  //       //     });
  //       //   fetchData();
  //       // }
  // }, []);

  let movie = {
    "title": "The Lord of The Rings",
    "rating": 92,
    "poster": "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY999_CR0,0,673,999_AL_.jpg",
    "genres": ["Fantasy", "Drama"],
    "plot": "The world is changed. I feel it in the water. I feel it in the earth. I smell it in the air. Much that once was is lost, for none now live who remember it." +
      " It began with the forging of the Great Rings. Three were given to the Elves, immortal, wisest and fairest of all beings. Seven to the Dwarf lords, great miners" +
      " and craftsmen of the mountain halls. And nine, nine rings were gifted to the race of Men, who, above all else, desire power. But they were, all of them, deceived," +
      " for another ring was made. In the land of Mordor, in the fires of Mount Doom, the Dark Lord Sauron forged in secret a Master Ring, to control all others. And into" +
      " this ring he poured his cruelty, his malice and his will to dominate all life. One Ring to rule them all!\n"
  };

  return (
    <Grid container className={classes.wrapper}>
      <Grid item xs={2} className={classes.buttonWrapper}>
        <Link to={"/"}>
          <Tooltip title="Back to overview" aria-label="add" placement="right">
            <IconButton aria-label="delete" className={classes.icon}>
            <ArrowBack fontSize="large" className={classes.returnButton} />
            </IconButton>
          </Tooltip>
        </Link>
      </Grid>
      <Grid item xs={10}>
      </Grid>
      <Grid item xs={4}>
        <CardMedia
          className={classes.poster}
          image={movie.poster}
        />
      </Grid>
      <Grid item xs={8} className={classes.metadataWrapper}>
        <h1 className={classes.title}> {movie.title} <span className={classes.rating}>{movie.rating} %</span> </h1>
        <typography className={classes.genres}> {movie.genres.join(" / ")} </typography>
        <typography className={classes.plot}> {movie.plot} </typography>
        <Grid item xs={4}>
          <Tooltip title="Add to favourites" aria-label="add" placement="right">
            <IconButton aria-label="delete" className={classes.icon}>
              <AddCircleOutline fontSize="large" className={classes.addButton} />
            </IconButton>
          </Tooltip>
      </Grid>
      <Grid item xs={8}>
      </Grid>
      </Grid>
    </Grid>
  )
}


export default MovieDetail;