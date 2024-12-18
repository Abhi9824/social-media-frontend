import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border spinner-color" role="status"></div>
    </div>
  );
};

export default Loading;
