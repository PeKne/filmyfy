import React, {useContext, useEffect, useState} from 'react';
import {useHistory, withRouter} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import {AddCircleOutline, ArrowBack} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from "@material-ui/core/Tooltip";
import {UserContext} from "../App";
import RemoveCircleOutline from "@material-ui/icons/esm/RemoveCircleOutline";


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
  const [favourites, setFavourites] = useState([]);
  const [seen, setSeen] = useState([]);
  const [isFavourite, setIsFavorite] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const history = useHistory();
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
      fetchFavourites();
      fetchSeen();
  }, []);

  const fetchFavourites = () => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/favourite_ids/')
      .then((response) => response.json())
      .then((data) => {
        setFavourites(data);
        setIsFavorite(data.includes(id));
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  };

  const fetchSeen = () => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/seen_ids/')
      .then((response) => response.json())
      .then((data) => {
        setSeen(data);
        setIsSeen(data.includes(id));
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  };

  const addFavourite = () => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/favourite/' + id + '/', {method: 'POST'})
      .then((response) => {
        if (!response.ok) {
          const error = new Error();
          error.message = `Error adding movie to favourites`;
          throw error;
        }
      });
    setIsFavorite(true);
    setIsSeen(true);
  };

  const removeFavourite = () => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/favourite/' + movie.id + '/', {method: 'DELETE'})
      .then((response) => {
        if (!response.ok) {
          const error = new Error();
          error.message = `Error removing movie from favourites`;
          throw error;
        }
      });
    setIsSeen(false);
    setIsFavorite(false);
  };

  const addSeen = () => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/seen/' + id + '/', {method: 'POST'})
      .then((response) => {
        if (!response.ok) {
          const error = new Error();
          error.message = `Error adding movie to seen`;
          throw error;
        }
      });
    setIsSeen(true);
  };

  return (
    <>
      {movie &&
      <Grid container className={classes.wrapper}>
        <Grid item xs={2} className={classes.buttonWrapper}>
            <Tooltip title="Back to overview" aria-label="add" placement="right">
              <IconButton aria-label="delete" className={classes.icon} onClick={() => {history.go(-2)}}>
                <ArrowBack fontSize="large" className={classes.returnButton}/>
              </IconButton>
            </Tooltip>
        </Grid>
        <Grid item xs={10}>
        </Grid>
        <Grid item xs={12} md={4}>
          <CardMedia
            className={classes.poster}
            image={movie.poster}
          />
        </Grid>
        <Grid item xs={12} md={8} className={classes.metadataWrapper}>
          <h1 className={classes.title}> {movie.title} <span className={classes.rating}>{movie.rating}</span></h1>
          <typography className={classes.genres}> {movie.genres.join(" / ")} </typography>
          <h2 typography className={classes.year}> {movie.year} </h2>
          <typography className={classes.plot}> {movie.plot} </typography>
          <Grid item xs={4}>
            {!isFavourite &&
              <Tooltip title="Add to favourites" aria-label="add" placement="right">
                <IconButton aria-label="delete" className={classes.addIcon} onClick={addFavourite}>
                  <AddCircleOutline fontSize="large"/>
                </IconButton>
              </Tooltip>
            }
            {isFavourite &&
            <Tooltip title="Remove from favourites" aria-label="add" placement="right">
              <IconButton aria-label="delete" className={classes.removeIcon} onClick={removeFavourite}>
                <RemoveCircleOutline fontSize="large"/>
              </IconButton>
            </Tooltip>
            }
            {!isSeen &&
            <Tooltip title="Mark as seen" aria-label="add" placement="right">
              <IconButton aria-label="delete" className={classes.addIcon} onClick={addSeen}>
                <CheckIcon fontSize="large"/>
              </IconButton>
            </Tooltip>
            }
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