import React, {useContext, useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {changePassword} from "./user";
import MySnackbarContentWrapper from "../MySnackbarContentWrapper";
import Snackbar from "@material-ui/core/Snackbar";
import {UserContext} from "../App";
import Card from "@material-ui/core/Card";
import LockIcon from '@material-ui/icons/Lock';
import CardContent from "@material-ui/core/CardContent";
import {Typography} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '100%'
  },
  link: {
    textDecoration: 'none',
    color: "#00AFF5"
  }
});


/**
 * Component for change of user's password
 *
 * @author Martin Balucha, Tatiana Fritzová
 */
const UserPasswordChange = () => {
  const MIN_PASSWORD_LENGTH = 8;
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedNewPassword, setConfirmedNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const submit = () => {
    if (newPassword !== confirmedNewPassword) {
      setMessage("New password and its confirmation are not the same");
      setSuccess(false);
      setAlert(true);
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setMessage("The new password is too short");
      setSuccess(false);
      setAlert(true);
      return;
    }

    changePassword(userContext.userInfo.id, oldPassword, newPassword, userContext.token)
      .then(response => {
        setMessage("Password successfully changed");
        setSuccess(true);
      })
      .catch(error => {
        console.log(error.message);
        setMessage("Error occurred during password change");
        setSuccess(false);
      });

    setAlert(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert(false);
  };

  useEffect(() => {
    if (newPassword && confirmedNewPassword && newPassword !== confirmedNewPassword) {
      setPasswordError("New passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmedNewPassword]);

  useEffect(() => {
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.")
    }
  }, [newPassword]);

  useEffect(() => {
    if (oldPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.")
    }
  }, [oldPassword]);

  return (
    <Grid container
          alignItems="stretch"
          justify="center"
          direction="column"
    >
        <Grid item xs={12} sm={6} md={4}
              alignItems="stretch"
              justify="center"
              direction="column"
              className={classes.root}
        >
          <Card>
            <CardContent variant="elevation" elevation={0}>
              <LockIcon style={{fontSize: 40}} color="primary"/>
              <Typography variant="h4" style={{padding: 15}}>
                Change Your Password
              </Typography>
              <Grid container
                    spacing={3}
                    alignItems="center"
                    justify="center"
                    direction="column">
                <Grid item xs={12} style={{width:'100%'}}>
                  <TextField label="Current password"
                             type="password"
                             fullWidth
                             InputLabelProps={{shrink: true}}
                             onChange={event => setOldPassword(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} style={{width:'100%'}}>
                  <TextField label="New password"
                             type="password"
                             fullWidth
                             InputLabelProps={{shrink: true}}
                             onChange={event => setNewPassword(event.target.value)}
                             error={passwordError}
                  />
                </Grid>
                <Grid item xs={12} style={{width:'100%'}}>
                  <TextField label="Confirm new password"
                             type="password"
                             fullWidth
                             InputLabelProps={{shrink: true}}
                             onChange={event => setConfirmedNewPassword(event.target.value)}
                             error={passwordError}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={submit} disabled={passwordError || !oldPassword}>
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={alert}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MySnackbarContentWrapper
          onClose={handleCloseSnackbar}
          variant={success ? "success" : "error"}
          message={message}
        />
      </Snackbar>
    </Grid>
  );
};

export default UserPasswordChange;