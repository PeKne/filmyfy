import React, {useContext, useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import {Info, InfoCaption, InfoSubtitle, InfoTitle,} from '@mui-treasury/components/info';
import {makeStyles} from '@material-ui/core/styles';
import {useGalaxyInfoStyles} from '@mui-treasury/styles/info/galaxy';
import {useCoverCardMediaStyles} from '@mui-treasury/styles/cardMedia/cover';
import {AddCircleOutline} from "@material-ui/icons";
import {Link, useHistory} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import {UserContext} from "../App";
import CardActions from "@material-ui/core/es/CardActions/CardActions";
import RemoveCircleOutline from "@material-ui/icons/esm/RemoveCircleOutline";


const useStyles = makeStyles(() => ({
  wrapper: {
    margin: "1.5em",
  },
  card: {
    borderRadius: '0.5rem',
    boxShadow: 'none',
    position: 'relative',
    width: 210,
    height: 300,
    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '64%',
      bottom: 0,
      zIndex: 1,
      background: 'linear-gradient(to top, #000, rgba(0,0,0,0))',
    },
    '&:hover': {
      WebkitBoxShadow: "5px 5px 10px 3px rgba(0,0,0,0.75)",
      BoxShadow: "5px 5px 5px 10px rgba(0,0,0,0.75)",
      MozBoxShadow: "5px 5px 10px 3px rgba(0,0,0,0.75)",
      color: "grey",
    },
  },
  actions: {
    zIndex: 2,
    background: 'linear-gradient(to bottom, #000, rgba(0,0,0,0))',
    position: "relative",
    paddingBottom: "30px",
  },
  content: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    textAlign: "left",
  },
  addIcon: {
    zIndex: 3,
    display: "block",
    position: "relative",
    padding: 0,
    color: "#72bb53",
    '&:hover': {
      color: "#9ce654",
    }
  },
  removeIcon: {
    zIndex: 3,
    display: "block",
    position: "relative",
    padding: 0,
    color: "#F0861C",
    '&:hover': {
      color: "#FCA651",
    }
  },

}));


function MovieThumbnail({isSeen, isFavourite, movie}) {
  const mediaStyles = useCoverCardMediaStyles({bgPosition: 'top'});
  const classes = useStyles();
  const [seen, setSeen] = useState(isSeen);
  const [favourite, setFavourite] = useState(isFavourite);
  const userContext = useContext(UserContext);
  const history = useHistory();

  const addFavourite = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/favourite/' + movie.id + '/', {method: 'POST'})
      .then((response) => {
        if (!response.ok) {
          const error = new Error();
          error.message = `Error adding movie to favourites`;
          throw error;
        }
      });
    setFavourite(true);
    setSeen(true);
  };

  const removeFavourite = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/favourite/' + movie.id + '/', {method: 'DELETE'})
      .then((response) => {
        if (!response.ok) {
          const error = new Error();
          error.message = `Error removing movie from favourites`;
          throw error;
        }
      });
    setFavourite(false);
  };

  const addSeen = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/seen/' + movie.id + '/', {method: 'POST'})
      .then((response) => {
        if (!response.ok) {
          const error = new Error();
          error.message = `Error adding movie to seen`;
          throw error;
        }
      });
    setSeen(true);
  };

  return (
    <Link to={"/movie/" + movie.id + "/"} className={classes.wrapper}>
      <Card className={classes.card}>
        <CardMedia
          classes={mediaStyles}
          image={movie.poster}
        />
        <Box py={3} px={2} className={classes.content}>
          <Info useStyles={useGalaxyInfoStyles}>
            <InfoTitle>{movie.title}</InfoTitle>
            <InfoSubtitle>{movie.rating}</InfoSubtitle>
            <InfoCaption> {
              movie.genres.slice(0, 3).join(" / ")}
            </InfoCaption>
          </Info>
        </Box>
        <CardActions className={classes.actions}>
          {!favourite &&
            <Tooltip title="Add to favourites" aria-label="add" placement="right">
              <IconButton aria-label="delete" className={classes.addIcon} onClick={addFavourite}>
                <AddCircleOutline fontSize="large"/>
              </IconButton>
            </Tooltip>
          }
          {favourite &&
          <Tooltip title="Remove from favourites" aria-label="add" placement="right">
            <IconButton aria-label="delete" className={classes.removeIcon} onClick={removeFavourite}>
              <RemoveCircleOutline fontSize="large"/>
            </IconButton>
          </Tooltip>
          }
          {!seen &&
          <Tooltip title="Mark as seen" aria-label="add" placement="right">
            <IconButton aria-label="delete" className={classes.addIcon} onClick={addSeen}>
              <CheckIcon fontSize="large"/>
            </IconButton>
          </Tooltip>
          }
        </CardActions>
      </Card>
    </Link>
  )
}

export default MovieThumbnail;