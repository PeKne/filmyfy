import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import Hidden from "@material-ui/core/Hidden";
import SmallMenu from "./SmallMenu";
import RegularMenu from "./RegularMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

/**
 * Application menu
 *
 */
const Menu = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Hidden smUp>
            <SmallMenu/>
          </Hidden>

          <Hidden xsDown>
            <RegularMenu/>
          </Hidden>
          </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(Menu);
