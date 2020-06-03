import React from "react";
import Typography from "@material-ui/core/Typography";

/**
 * Component for informing the user that an error occurred (e.g. 500 from the server).
 *
 * @author Tatiana Fritzová
 */
const ErrorPage = () => {
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

  return (
    <div style={style}>
      <Typography variant="h4">Opps! Something went wrong.</Typography>
      <Typography variant="body2">Please, try again or contact the administrator.</Typography>
    </div>
  );
};

export default ErrorPage;