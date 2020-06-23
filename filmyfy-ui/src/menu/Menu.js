import React, {useContext} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, withRouter} from "react-router-dom";
import Typography from "@material-ui/core/es/Typography/Typography";
import Link from "react-router-dom/es/Link";
import {UserContext} from "../App";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import Button from "@material-ui/core/es/Button/Button";
import AccountBoxIcon from '@material-ui/icons/AccountBox';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: "#000"
  },

  controlWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    padding: "3px 0 0 0 !important",
  },
  user: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 20px",
  },
  link: {
    textDecoration: 'none',
    color: "#00AFF5",
    padding: "0 20px",
  },
  logout: {
    padding: "0 20px 2px 20px !important"
  }
}));

/**
 * Application menu
 *
 */
const Menu = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography edge="start" className={classes.title}>
            <Link to={"/"}>
            <img src={process.env.PUBLIC_URL + '/logo_filmyfy.png'} alt="logo" width={270}/>
            </Link>
          </Typography>
          {userContext.userInfo &&
          <div className={classes.controlWrapper}>
            <Button color="secondary" className={classes.button}>
              <Link to={`/`} className={classes.link}>Recommendations</Link>
            </Button>
            <Button color="secondary" className={classes.button}>
              <Link to={`/favourite`} className={classes.link}>My favourites</Link>
            </Button>
            <Typography className={classes.user}>
              <AccountBoxIcon/><b>{userContext.userInfo.username}</b>
            </Typography>
            <Tooltip title="Logout">
              <IconButton className={classes.logout} aria-label="logout" onClick={() => {
                userContext.logout();
                history.push("/");
              }
              }
              color="primary">
                <ExitToAppIcon/>
              </IconButton>
            </Tooltip>
          </div>
          }
          </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(Menu);
