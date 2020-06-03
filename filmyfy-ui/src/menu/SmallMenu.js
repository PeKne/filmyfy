import React, {useContext, useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Button from "@material-ui/core/Button";
import {withRouter, useHistory, Link} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {UserContext} from "../App";
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
    color: "#00AFF5"
  },
}));

const SmallMenuItem = props => {
  const {to, text} = props;
  const classes = useStyles();
  return (
    <ListItem>
      <Button>
        <Link to={to} className={classes.link}>{text}</Link>
      </Button>
    </ListItem>
  );
};

/**
 * Application menu for small screens
 *
 * @author Tatiana Fritzová
 */
const SmallMenu = () => {
  const userContext = useContext(UserContext);
  const history = useHistory();
  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);

  const toggleDrawer = (open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setShowMenu(open);
  };

  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
    >
      <SmallMenuItem to={'/ride/search'} text={"Find a ride"}/>
      <SmallMenuItem to={'/ride/offer'} text={"Offer a ride"}/>
      <Divider/>
      {userContext.userInfo &&
      <>
        <SmallMenuItem to={'/my-reservations'} text={"My Reservations"}/>
        <SmallMenuItem to={'/my-rides'} text={'My Rides'}/>
        <SmallMenuItem to={'/my-profile'} text={'My Profile'}/>
        <Divider/>
      </>
      }
      {userContext.userInfo && userContext.userInfo.admin &&
      <>
        <Divider/>
        {/*<SmallMenuItem to={'/user/list'} text={"List users"}/>*/}
        <SmallMenuItem to={'/ride/list'} text={"List rides"}/>
      </>
      }
      <Divider/>
      {!userContext.userInfo &&
      <SmallMenuItem to={`/sign-in`} text="Sign in"/>
      }
      {userContext.userInfo &&
      <ListItem>
        <Button onClick={() => {
          userContext.logout();
          history.push("/");
        }}>
          Sign out
        </Button>
      </ListItem>
      }
    </div>
  );

  return (
    <>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        open={showMenu}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {sideList()}
      </SwipeableDrawer>
    </>
  );

};

export default withRouter(SmallMenu);