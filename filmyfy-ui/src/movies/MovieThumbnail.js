import React, {useContext, useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import {Info, InfoCaption, InfoSubtitle, InfoTitle,} from '@mui-treasury/components/info';
import {makeStyles} from '@material-ui/core/styles';
import {useGalaxyInfoStyles} from '@mui-treasury/styles/info/galaxy';
import {useCoverCardMediaStyles} from '@mui-treasury/styles/cardMedia/cover';
import {AddCircleOutline} from "@material-ui/icons";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import {UserContext} from "../App";


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
  content: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    textAlign: "left",
  },
  icon: {
    zIndex: 3,
    display: "block",
    position: "relative",
    padding: 0,
    color: "#72bb53",
    '&:hover': {
      color: "#9ce654",
    }
  }
}));


function MovieThumbnail({movie}) {
  const mediaStyles = useCoverCardMediaStyles({bgPosition: 'top'});
  const [favourites, setFavourites] = useState([]);
  const classes = useStyles();
  const userContext = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + 'favourite_ids/')
      .then((response) => response.json())
      .then((data) => {
        setFavourites(data);
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  }, []);

  const addFavourite = () => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/favourite/' + movie.id + '/', {method: 'POST'})
      .then((response) => {
        if (!response.ok) {
          const error = new Error();
          error.message = `Error adding movie to favourites`;
          throw error;
        }
      });
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
        <Tooltip title="Add to favourites" aria-label="add" placement="right">
            <IconButton aria-label="delete" className={classes.icon} onClick={addFavourite}>
              <AddCircleOutline fontSize="large" className={classes.addButton} />
            </IconButton>
        </Tooltip>
      </Card>
    </Link>
  )
}

export default MovieThumbnail;