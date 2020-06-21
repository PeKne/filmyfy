import ReactLoading from "react-loading";
import React from "react";

/**
 * Component to be displayed while waiting for a response.
 *
 */
const Loader = () => {
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  };

  return (
    <div style={style}>
      <ReactLoading type={"spin"} color={"#00AFF5"}/>
    </div>
  );
};

export default Loader;