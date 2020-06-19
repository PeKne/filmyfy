import React, {useContext, useEffect, useState} from 'react';
import {Link, withRouter} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import {AddCircleOutline, ArrowBack} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import {UserContext} from "../App";


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
    '&:hover': {
      color: "#9ce654",
    },
    backgroundColor: "#fff",
    borderRadius: "1em",
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


const MovieDetail = props => {
  const [movie, setMovie] = useState(undefined);
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const {id} = props.match.params;

  useEffect(() => {
      fetch('http://localhost:8000/api/movie/' + id + "/")
        .then((response) => response.json())
        .then((data) => {
          setMovie(data);
        })
        .catch((err) => {
          console.log('Error: ' + err);
        });
  }, []);

  const addFavourite = () => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/favourite/' + id + '/', {method: 'POST'})
      .then((response) => {
        if (!response.ok) {
          const error = new Error();
          error.message = `Error adding movie to favourites`;
          throw error;
        }
      });
  };

  return (
    <>
      {movie &&
      <Grid container className={classes.wrapper}>
        <Grid item xs={2} className={classes.buttonWrapper}>
          <Link to={"/"}>
            <Tooltip title="Back to overview" aria-label="add" placement="right">
              <IconButton aria-label="delete" className={classes.icon}>
                <ArrowBack fontSize="large" className={classes.returnButton}/>
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
          <h1 className={classes.title}> {movie.title} <span className={classes.rating}>{movie.rating}</span></h1>
          <typography className={classes.genres}> {movie.genres.join(" / ")} </typography>
          <typography className={classes.plot}> {movie.plot} </typography>
          <Grid item xs={4}>
            <Tooltip title="Add to favourites" aria-label="add" placement="right">
              <IconButton aria-label="delete" className={classes.icon} onClick={addFavourite}>
                <AddCircleOutline fontSize="large" className={classes.addButton}/>
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={8}>
          </Grid>
        </Grid>
      </Grid>
      }
    </>
  )
};


export default withRouter(MovieDetail);