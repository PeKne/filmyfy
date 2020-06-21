import React, {useContext, useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import MovieThumbnail from './MovieThumbnail';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";
import {UserContext} from "../App";
import {fade} from "@material-ui/core/styles/index";
import InputBase from "@material-ui/core/es/InputBase/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import Loader from "../Loader";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "80%",
    margin: "0 auto",
    textAlign: "left",
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#9B9B9B",
    '&:hover': {
      backgroundColor: fade("#9B9B9B", 0.40),
    },
    marginLeft: 0,
    marginTop: 20,
    width: '100%',
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
  inputInput: {
    padding: theme.spacing(1, 3, 1, 0),
    paddingLeft: theme.spacing(6),
    width: '100%',
  },
  inputField: {
    width: '100%'
  }
}));

const MovieList = props => {
  const classes = useStyles();
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [seen, setSeen] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext);
  const {
    listType
  } = props;

  const onSearch = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value) {
        fetchSearch(e);
      } else {
        fetchRecommended();
      }
    }
  };

  const fetchSearch = (e) => {
    setLoading(true);
    fetch('http://localhost:8000/api/movie/find/' + e.target.value + '/')
      .then((response) => response.json())
      .then((data) => {
        setTitle("Search result");
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  };

  const fetchFavourites = () => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/favourite_ids/')
      .then((response) => response.json())
      .then((data) => {
        setFavourites(data)
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  };

  const fetchSeen = () => {
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/seen_ids/')
      .then((response) => response.json())
      .then((data) => {
        setSeen(data)
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  };

  const fetchRecommended = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/user/' + userContext.userInfo.username + '/' + listType + '/')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setTitle(listType === "recommend" ? "Movies for you" : "Your favourite movies");
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  };

  useEffect(() => {
    fetchRecommended();
    fetchFavourites();
    fetchSeen();
  }, []);

  const MovieThumbnails = [];

  if (movies.length > 0) {
      for (let i in movies) {
          MovieThumbnails.push(
              <MovieThumbnail
                isSeen={seen.includes(movies[i].id)}
                isFavourite={favourites.includes(movies[i].id)}
                movie={movies[i]}
              />
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
          <InputBase className={classes.inputField}
            placeholder="Search…"
            onKeyDown={(e) => onSearch(e)}
          />
        </div>
      </div>

      <h1>{title}</h1>
      {loading &&
        <Loader />
      }
      {!loading &&
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        {MovieThumbnails}
      </Grid>
      }
    </div>
  );
};

export default withRouter(MovieList);