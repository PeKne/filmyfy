import React, {useContext, useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import MovieThumbnail from './MovieThumbnail';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";
import {UserContext} from "../App";
import {fade} from "@material-ui/core/styles/index";
import InputBase from "@material-ui/core/es/InputBase/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import Loader from "../Loader";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

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
  sliderWrapper: {
    padding: "25px"
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
  clearIcon: {
    padding: 0,
  },
  inputInput: {
    padding: theme.spacing(1, 3, 1, 0),
    display: 'inline-flex',
    flexDirection: 'row',
    paddingLeft: theme.spacing(6),
    width: '100%',
  },
  inputField: {
    width: '100%'
  }
}));

function valuetext(value) {
  return `value`;
}

const yearFilterMarks = [
  {
    value: 1900,
    label: '1900',
  },
  {
    value: 1920,
    label: '1920',
  },
  {
    value: 1940,
    label: '1940',
  },
  {
    value: 1960,
    label: '1960',
  },
  {
    value: 1980,
    label: '1980',
  },
  {
    value: 2000,
    label: '2000',
  },
  {
    value: 2020,
    label: '2020',
  }
];

const ratingFilterMarks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 2.5,
    label: '2.5',
  },
  {
    value: 5.0,
    label: '5.0',
  },
  {
    value: 7.5,
    label: '7.5',
  },
  {
    value: 10,
    label: '10',
  }
];

const MovieList = props => {
  const classes = useStyles();
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [seen, setSeen] = useState([]);
  const [title, setTitle] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext);
  const [yearFilter, setYearFilter] = React.useState([1900, 2020]);
  const [ratingFilter, setRatingFilter] = React.useState([0, 100]);
  const handleYearfilterChange = (event, newValue) => {
    setYearFilter(newValue);
  };
  const handleRatingfilterChange = (event, newValue) => {
    setRatingFilter(newValue);
  };
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
    const filteredMovies = movies.filter(function (el) {
      let intYear = parseInt(el.year);
      return intYear <= yearFilter[1] &&
        intYear >= yearFilter[0] &&
        el.rating >= ratingFilter[0] &&
        el.rating <= ratingFilter[1];
    });
    debugger
    for (let i in filteredMovies) {
      MovieThumbnails.push(
        <MovieThumbnail
          isSeen={seen.includes(filteredMovies[i].id)}
          isFavourite={favourites.includes(filteredMovies[i].id)}
          movie={filteredMovies[i]}
        />
      );
    }
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon/>
        </div>
        <div className={classes.inputInput}>
          <InputBase className={classes.inputField}
                     placeholder="Search in movie database"
                     value={searchText}
                     onChange={(e) => {
                       setSearchText(e.target.value)
                     }}
                     onKeyDown={(e) => onSearch(e)}
          />
          <IconButton className={classes.clearIcon} onClick={() => {
            setSearchText("");
            fetchRecommended();
          }}>
            <ClearIcon/>
          </IconButton>
        </div>

      </div>
      <Grid container>
        <Grid item md={6} xs={12} className={classes.sliderWrapper}>
          <Typography id="discrete-slider" gutterBottom>
            Rating
          </Typography>
          <Slider
            value={ratingFilter}
            onChange={handleRatingfilterChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            getAriaValueText={valuetext}
            min={0}
            max={10}
            step={0.1}
            marks={ratingFilterMarks}
          />
        </Grid>
        <Grid item md={6} xs={12} className={classes.sliderWrapper}>
          <Typography id="discrete-slider" gutterBottom>
            Year
          </Typography>
          <Slider
            value={yearFilter}
            onChange={handleYearfilterChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            getAriaValueText={valuetext}
            min={1900}
            max={2020}
            marks={yearFilterMarks}
          />
        </Grid>

      </Grid>

      <h1>{title}</h1>
      {loading &&
      <Loader/>
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