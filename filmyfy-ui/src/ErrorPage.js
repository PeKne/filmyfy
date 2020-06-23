import React from "react";
import Typography from "@material-ui/core/Typography";

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