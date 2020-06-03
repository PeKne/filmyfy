import makeStyles from "@material-ui/core/styles/makeStyles";
import {update} from "./user";
import React, {useContext, useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import MySnackbarContentWrapper from "../MySnackbarContentWrapper";
import Snackbar from "@material-ui/core/Snackbar";
import {UserContext} from "../App";
import {Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import {Link} from "react-router-dom";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles({
  root: {
    minWith: 300,
  },
  link: {
    textDecoration: 'none',
    color: "#00AFF5"
  }
});

/**
 * Component for the user edit
 *
 * @author Martin Balucha, Tatiana Fritzová
 */
const UserEdit = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const [name, setName] = useState(userContext.userInfo.name);
  const [surname, setSurname] = useState(userContext.userInfo.surname);
  const [email] = useState(userContext.userInfo.email);
  const [phone, setPhone] = useState(userContext.userInfo.phone);
  const [phoneError, setPhoneError] = useState("osfoidj");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert(false);
  };

  useEffect(() => {
    const phoneRegex = /^(00|\+(421|420))[0-9]{9}$/;
    if (!phone || phoneRegex.test(phone)) {
      setPhoneError("")
    } else {
      setPhoneError("Incorrect phone number format")
    }
  }, [phone]);

  const submit = () => {
    update(userContext.userInfo.id, name, surname, email, phone, userContext.token)
      .then(response => {
        setMessage("User was successfully updated");
        setSuccess(true);
        userContext.updateUser(name, surname, phone);
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        setMessage("Error occurred during the user's update");
        setSuccess(false);
      });

    setAlert(true);
  };

  return (
    <>
      <Grid container
            alignItems="stretch"
            justify="center"
            direction="column"
      >
        <Grid item xs={12} sm={6} md={4} style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: '100%'
        }}>
          <Card variant="elevation" elevation={0}>
            <CardContent>
              <AccountCircleIcon style={{fontSize: 40}} color="primary"/>
              <Typography variant="h4" style={{padding: 15}}>
                My Profile
              </Typography>
              <Grid container
                    spacing={3}
                    alignItems="center"
                    justify="center"
                    direction="column">
                <Grid item xs={12} style={{width: '100%'}}>
                  <TextField label="Email"
                             disabled
                             defaultValue={userContext.userInfo.email}
                             InputLabelProps={{shrink: true}}
                             InputProps={{readOnly: true}}
                             fullWidth
                  />
                </Grid>
                <Grid item xs={12} style={{width: '100%'}}>
                  <TextField label="Name"
                             defaultValue={userContext.userInfo.name}
                             InputLabelProps={{shrink: true}}
                             onChange={event => setName(event.target.value)}
                             fullWidth
                  />
                </Grid>
                <Grid item xs={12} style={{width: '100%'}}>
                  <TextField label="Surname"
                             defaultValue={userContext.userInfo.surname}
                             InputLabelProps={{shrink: true}}
                             onChange={event => setSurname(event.target.value)}
                             fullWidth
                  />
                </Grid>
                <Grid item xs={12} style={{width: '100%'}}>
                  <TextField label="Phone number"
                             defaultValue={userContext.userInfo.phone}
                             placeholder={userContext.userInfo.phone ? "" : "Add phone number"}
                             InputLabelProps={{shrink: true}}
                             onChange={event => setPhone(event.target.value)}
                             error={phoneError}
                             fullWidth

                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button color="primary">
                <Link className={classes.link} to={`/my-password`}>
                  Change Password
                </Link>
              </Button>
              <Button color="primary" onClick={submit} disabled={phoneError}>
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                open={alert}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
      >
        <MySnackbarContentWrapper onClose={handleCloseSnackbar}
                                  variant={success ? "success" : "error"}
                                  message={message}
        />
      </Snackbar>
    </>
  );
};

export default UserEdit;