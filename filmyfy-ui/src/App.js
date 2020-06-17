import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {NotFound} from "./NotFound";
import Menu from "./menu/Menu";
import RecommendedMovies from "./movies/RecommendedMovies"
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import SignIn from "./auth/SignIn";
import MovieDetail from "./movies/MovieDetail";


export const UserContext = React.createContext({
  userInfo: undefined,
  login: undefined,
  logout: undefined
});

const App = () => {

  const [userInfo, setUserInfo] = useState(undefined);

  const login = (username, password, onError, onSuccess) => {

    const url = 'http://localhost:8000/api/user/login/';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    };

    fetch(url, options)
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          return undefined;
        }
      })
      .then(token => {
        if (token) {
          setUserInfo({"token": token, "username": username});
          onSuccess();
        } else {
          setUserInfo(undefined);
          onError();
        }
      });
  };

  const logout = () => {
    setUserInfo(undefined);
  };

  const context = {
    userInfo: userInfo,
    login: login,
    logout: logout
  };

  const ourTheme = createMuiTheme({
    palette: {
      primary: {
        main: "#00AFF5"
      },
      secondary: {
        main: "#ffffff"
      }
    }
  });

  return (
    <MuiThemeProvider theme={ourTheme}>
      <Router>
        <UserContext.Provider value={context}>
          <Menu/>
          <div className="App">
            <Switch>
              {!userInfo &&
              <Route exact path="/"
                     render={props => <SignIn {...props}/>}
              />
              }
              {userInfo &&
                <>
                <Route exact path="/"
                       render={props => <RecommendedMovies {...props} userInfo={userInfo}/>}/>

                <Route path="/movie/:id/" render={(props) => <MovieDetail {...props} />}/>
                </>
              }
              <Route render={NotFound}/>
            </Switch>
          </div>
        </UserContext.Provider>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
