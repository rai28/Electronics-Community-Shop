import React from "react";

export default function LoadingBox() {
  return (
    <div className="center-all loading">
      <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
