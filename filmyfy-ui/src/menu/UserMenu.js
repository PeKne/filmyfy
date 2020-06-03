import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import {UserContext} from "../App";
import {Link} from "react-router-dom";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useHistory} from "react-router-dom";
import Divider from "@material-ui/core/Divider";


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  list: {
    width: 250,
  },
  link: {
    textDecoration: 'none',
    color: "#00AFF5"
  },
}));

/**
 * Application menu for bigger screens when user is logged in.
 *
 * @author Tatiana Fritzová
 */
export default function UserMenu() {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const history = useHistory();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          {userContext.userInfo.name} {userContext.userInfo.surname} <ExpandMoreIcon />
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem>
                      <Link to={`/my-reservations`} className={classes.link}>My reservations</Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={`/my-rides`} className={classes.link}>My Rides</Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to={`/my-profile`} className={classes.link}>My Profile</Link>
                    </MenuItem>
                    {userContext.userInfo && userContext.userInfo.admin &&
                      <>
                        <Divider/>
                        {/*<MenuItem>*/}
                        {/*  <Link to={`/user/list`} className={classes.link}>List Rides</Link>*/}
                        {/*</MenuItem>*/}
                        <MenuItem>
                          <Link to={`/ride/list`} className={classes.link}>List Rides</Link>
                        </MenuItem>
                      </>
                    }
                    <Divider/>
                    <MenuItem onClick={() => {
                        userContext.logout();
                        history.push("/");
                      }} className={classes.link}>
                        Sign out
                      </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}
