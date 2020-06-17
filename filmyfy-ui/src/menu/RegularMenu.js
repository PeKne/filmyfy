import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import UserMenu from "./UserMenu";
import React, {useContext} from "react";
import {UserContext} from "../App";
import {Link, withRouter} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
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

const RegularMenu = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);

  return (
    <>
      <Typography className={classes.title} variant="h3" noWrap edge="start">
        <Link to={"/"} className={classes.title}>
          <b>Filmyfy</b>
        </Link>
      </Typography>
      <Button color="secondary">
        <Link to={`/`} className={classes.link}>Recommended movies</Link>
      </Button>
      {userContext.userInfo &&
      <UserMenu/>
      }
    </>
  );
};

export default withRouter(RegularMenu);