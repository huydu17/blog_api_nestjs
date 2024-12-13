import React from "react";

export default function Loader() {
  return (
    <div className="position-absolute top-0 start-0 bottom-0 end-0 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
