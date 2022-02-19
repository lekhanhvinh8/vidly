import React from "react";
import { Link } from "react-router-dom";

const Customers = () => {
  const array = [...Array(100)];
  return (
    <div>
      <h1>Customer</h1>
      {array.map((e, index) => (
        <div key={index}>
          <Link to="/rentals">123</Link>
        </div>
      ))}
    </div>
  );
};

export default Customers;
