import React from "react";

const Loader = () => {
  return (
    <>
      <div
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div color="primary" size={50} />
      </div>
    </>
  );
};

export default Loader;
