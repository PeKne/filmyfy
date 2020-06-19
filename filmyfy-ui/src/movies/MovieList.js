import React, {useEffect, useState, useContext} from "react";
import {withRouter} from "react-router-dom";
import MovieThumbnail from './MovieThumbnail';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";
import {UserContext} from "../App";
import {fade} from "@material-ui/core/styles/index";
import InputBase from "@material-ui/core/es/InputBase/InputBase";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "80%",
    margin: "0 auto",
    textAlign: "left",
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 3, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: theme.spacing(6),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '22ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
}));

const MovieList = props => {
  const {
    listType
  } = props;
  const classes = useStyles();
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState(listType === "recommend" ? "Movies for you" : "Your favourite movies");
  const userContext = useContext(UserContext);

  const onSubmit = (e) => {
    if (e.key === 'Enter') {
      fetch('http://localhost:8000/api/movie/find/' + e.target.value + '/')
        .then((response) => response.json())
        .then((data) => {
          setTitle("Search result");
          setMovies(data);
        })
        .catch((err) => {
          console.log('Error: ' + err);
        });
    }
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/' + listType + '/')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
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
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <div className={classes.inputInput}>
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onKeyDown={(e) => onSubmit(e)}
          />
        </div>
      </div>

      <h1>{title}</h1>
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