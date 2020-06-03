import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {NotFound} from "./NotFound";
import RideList from "./ride/RideList";
import Menu from "./menu/Menu";
import RideSearch from "./ride/RideSearch";
import {listAll} from "./ride/ride";
import RideSearchResult from "./ride/RideSearchResult";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import MyRides from "./ride/MyRides";
import MyReservations from "./reservation/MyReservations";
import RideOffer from "./ride/RideOffer";
import SignIn from "./auth/SignIn";
import RideDetail from "./ride/RideDetail";
import UserDetail from "./user/UserDetail";
import UserEdit from "./user/UserEdit";
import UserPasswordChange from "./user/UserPasswordChange";


export const UserContext = React.createContext({
  userInfo: undefined,
  updateUser: undefined,
  token: undefined,
  login: undefined,
  logout: undefined
});

const App = () => {

  const [userInfo, setUserInfo] = useState(undefined);
  const [token, setToken] = useState(undefined);

  const login = (username, password, onError, onSuccess) => {
    let credentials = new URLSearchParams();
    credentials.append('username', username);
    credentials.append('password', password);

    const url = 'http://localhost:8080/pa165/login';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'cache-control': 'no-cache'
      },
      body: credentials.toString()
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
          setToken("Bearer " + token);
          onSuccess();
        } else {
          setToken(undefined);
          onError();
        }
      });
  };

  useEffect(() => {
    if (!!token) {
      const url = 'http://localhost:8080/pa165/rest/user/me';
      const options = {
        method: 'GET',
        headers: {
          'authorization': token
        }
      };
      fetch(url, options)
        .then(response => response.json()) //todo error handling
        .then(data => setUserInfo(data));
    } else {
      setUserInfo(undefined);
    }
  }, [token]);

  const logout = () => {
    setUserInfo(undefined);
    setToken(undefined);
  };

  const updateUser = (userName, userSurname, userPhone) => {
    setUserInfo({...userInfo, name: userName, surname: userSurname, phone: userPhone})
  };

  const updateUserInfo = (newUserInfo) => {
    if (!!newUserInfo) {
      setUserInfo({...userInfo, ...newUserInfo});
    } else {
      setUserInfo(undefined);
    }
  };

  const context = {
    userInfo: userInfo,
    token: token,
    updateUser: updateUser,
    updateUserInfo: updateUserInfo,
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
              <Route exact path="/"
                     render={props => <SignIn {...props}/>}/>
              {userInfo && userInfo.admin &&
              <Route exact path="/ride/list"
                     render={props => <RideList fetch={listAll} {...props}/>}
              />
              }
              <Route exact path="/ride/search"
                     render={props => <RideSearch {...props}/>}
              />
              <Route exact path={[
                "/ride/list/city/:from/:to/departure/:minDeparture/:maxDeparture",
                "/ride/list/city/:from/:to/departure/:minDeparture",
                "/ride/list/city/:from/:to"]}
                     render={props => <RideSearchResult {...props} />}
              />
              <Route exact path="/ride/offer"
                     render={props => <RideOffer {...props}/>}
              />
              <Route exact path="/user/:id"
                     render={props => <UserDetail {...props} />}
              />
              <Route path="/ride/:id"
                     render={props => <RideDetail {...props} />}
              />
              {!userInfo &&
              <Route exact path="/sign-in"
                     render={props => <SignIn {...props}/>}
              />
              }
              {userInfo &&
              <>
                <Route exact path="/my-rides"
                       render={props => <MyRides {...props}/>}/>
                <Route exact path="/my-reservations"
                       render={props => <MyReservations {...props} />}/>
                <Route exact path="/my-profile"
                       render={props => <UserEdit {...props} />}/>
                <Route exact path="/my-password"
                       render={props => <UserPasswordChange {...props} />}/>
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
