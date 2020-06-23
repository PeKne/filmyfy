import React, {useContext, useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useHistory, withRouter} from "react-router-dom";
import {UserContext} from "../App";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

/**
 * Component for creating a new user.
 */
const Register = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState(false);
  const [match, setMatch] = useState(false);
  const userContext = useContext(UserContext);
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();
    if (match && username) {
      userContext.register(username, password, () => setError(true), () => history.push("/"))
    }
  };

  useEffect(() => {
      setMatch(password === passwordAgain)
  }, [password, passwordAgain]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon color={"primary"}/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form}>
          <TextField
            error={!username}
            helperText="Username must not be empty"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="username"
            autoFocus
            value={username}
            onInput={e => setUsername(e.target.value)}
          />
          <TextField
            error={!match}
            helperText="Passwords do not match"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onInput={e => setPassword(e.target.value)}
          />
          <TextField
            error={!match}
            helperText="Passwords do not match"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password_again"
            label="Password again"
            type="password"
            id="password_again"
            value={passwordAgain}
            onInput={e => setPasswordAgain(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Register
          </Button>
        </form>
      </div>
      {error &&
      <Alert severity="error">
        <AlertTitle>Register failed</AlertTitle>
        The username already exists.
      </Alert>
      }
    </Container>
  );
};

export default withRouter(Register);