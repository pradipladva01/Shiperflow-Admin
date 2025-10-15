import React from "react";
import { Link } from "react-router-dom";

const FourOhFour = () => {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 text-center">
          <h1 className="display-1 text-muted">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-4">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <Link to="/admin/dashboard" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FourOhFour;
