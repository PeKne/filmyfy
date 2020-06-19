import React, {useContext} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {fade, makeStyles} from '@material-ui/core/styles';
import {useHistory, withRouter} from "react-router-dom";
import Typography from "@material-ui/core/es/Typography/Typography";
import Link from "react-router-dom/es/Link";
import {UserContext} from "../App";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import Button from "@material-ui/core/es/Button/Button";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: "#000"
  },
  link: {
    textDecoration: 'none',
    color: "#00AFF5"
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
          <Typography className={classes.title} variant="h3" noWrap edge="start">
            <Link to={"/"} className={classes.title}>
              <b>Filmyfy</b>
            </Link>
          </Typography>

          {userContext.userInfo &&
          <>
            <Button color="secondary">
              <Link to={`/ride/search`} className={classes.link}>Find a ride</Link>
            </Button>
            <Typography>
              <b>{userContext.userInfo.username}</b>
            </Typography>
            <Tooltip title="Logout">
              <IconButton aria-label="logout" onClick={() => {
                userContext.logout();
                history.push("/");
              }
              }
              color="primary">
                <ExitToAppIcon/>
              </IconButton>
            </Tooltip>
          </>
          }
          </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(Menu);
