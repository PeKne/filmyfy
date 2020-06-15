import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import UserMenu from "./UserMenu";
import React, {useContext} from "react";
import {UserContext} from "../App";
import {withRouter, Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
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
        <b>Filmyfy</b>
       </Typography>
       <Button color="secondary">
         <Link to={`/ride/search`} className={classes.link}>Recommended movies</Link>
       </Button>
       <Button color="secondary">
         <Link to={`/ride/offer`} className={classes.link}>Offer a ride</Link>
       </Button>
       {userContext.userInfo &&
       <UserMenu/>
       }
     </>
   );
};

export default withRouter(RegularMenu);