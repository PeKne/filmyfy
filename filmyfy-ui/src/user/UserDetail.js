import React, {useEffect, useState, useContext} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {withRouter} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import {find} from "./user";
import Loader from "../Loader";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Grid from "@material-ui/core/Grid";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReviewList from "../review/ReviewList";
import {canCreate, getUsersRating, listForUser} from "../review/review";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import CreateReview from "../review/CreateReview";
import {UserContext} from "../App";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Rating from "@material-ui/lab/Rating";
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles({
  root: {
    minWidth: 300,
    alignItems: "center",
  },
  title: {
    fontSize: 14,
  },
  large: {
    width: 50,
    height: 50,
    display: "inline-flex",
  },
});

/**
 * A component for detail of any user
 * @author Martin Balucha, Tatiana Fritzová
 */
const UserDetail = props => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const {id} = props.match.params;
  const [loading, setLoading] = useState(true);
  const [viewedUser, setViewedUser] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [createdReview, setCreatedReview] = useState(false);
  const [rating, setRating] = useState(undefined);

  useEffect(() => {
    find(id)
      .then(response => {
        setViewedUser(response);
        setLoading(false);
      })
      .catch(e => console.error(e.message));
  }, [id]);

  useEffect(() => {
    getUsersRating(id)
      .then(response => setRating(response));
    if (userContext.userInfo) {
      canCreate(id, userContext.userInfo.id, userContext.token)
        .then(response => setCanReview(response === 'true'));
    } else {
      setCanReview(false);
    }
  }, [viewedUser, id, userContext.userInfo, userContext.token]);

  const onClose = () => setOpen(false);

  const onReviewCreate = () => {
    setCreatedReview(!createdReview);
    fetchUsersRating();
  };

  const fetchUsersRating = () => {
    getUsersRating(id)
      .then(response => setRating(response));
  };

  return (
    <>
      {loading && <Loader/>}
      {!loading &&
      <Grid container
            alignItems="center"
            justify="center"
            direction="column"
            style={{paddingTop: 15}}
      >
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="elevation" elevation={1}>
            <CardContent>
              <Grid container
                    spacing={3}
                    alignItems="center"
                    justify="center"
                    direction="column">
                <Grid item xs={12} style={{width: '100%'}}>
                  <Avatar className={classes.large}/>
                </Grid>
                <Grid item xs={12} style={{width: '100%'}}>
                  <Rating name="user-rating"
                          value={Math.round(rating * 100) / 100}
                          precision={0.01}
                          size="large"
                          readOnly/>
                </Grid>
                <Grid item xs={12} style={{width: '100%'}}>
                  <TextField label="Email"
                             defaultValue={viewedUser.email}
                             InputLabelProps={{shrink: true}}
                             InputProps={{readOnly: true}}
                             fullWidth
                  />
                </Grid>
                <Grid item xs={12} style={{width: '100%'}}>
                  <TextField label="Name"
                             defaultValue={viewedUser.name}
                             InputLabelProps={{shrink: true}}
                             InputProps={{readOnly: true}}
                             fullWidth
                  />
                </Grid>
                <Grid item xs={12} style={{width: '100%'}}>
                  <TextField label="Surname"
                             defaultValue={viewedUser.surname}
                             InputLabelProps={{shrink: true}}
                             InputProps={{readOnly: true}}
                             fullWidth
                  />
                </Grid>
                {viewedUser.phone &&
                <Grid item xs={12} style={{width: '100%'}}>
                  <TextField label="Phone number"
                             defaultValue={viewedUser.phone}
                             InputLabelProps={{shrink: true}}
                             fullWidth
                  />
                </Grid>
                }
                {canReview  &&
                <Grid item xs={12} style={{width: '100%', paddingTop: 10}}>
                  <Button color="primary" onClick={() => setOpen(true)}>
                    <CreateIcon/> Write a review
                  </Button>
                  <CreateReview user={viewedUser}
                                onCreate={onReviewCreate}
                                onClose={onClose}
                                open={open}
                  />
                </Grid>
                }
                <Grid item xs={12} style={{width: '100%'}}>
                  <ExpansionPanel style={{marginTop: 10}}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                      <Typography variant="h5">Reviews</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <ReviewList updated={createdReview}
                                  onUpdate={fetchUsersRating}
                                  fetch={() => listForUser(id)}
                      />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      }
    </>
  );
};

export default withRouter(UserDetail);