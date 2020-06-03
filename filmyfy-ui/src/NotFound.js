import React from 'react';
import Typography from '@material-ui/core/Typography';


/**
 * Fallback component for paths that has not been mapped to a specific route.
 *
 * @author Tatiana Fritzová
 */
export function NotFound() {
  return (
    <>
      <img src={process.env.PUBLIC_URL + '/confused-travolta-png-gif-1.gif'} alt="Not found" width={300}/>
      <Typography gutterBottom variant="h5" component="h2">
        Not Found
      </Typography>
      <Typography variant="body2" color="textSecondary" component="p">
        Sorry, we could not find what you are looking for :/
      </Typography>
    </>
  );
}
