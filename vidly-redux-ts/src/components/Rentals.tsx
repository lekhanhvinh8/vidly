import React from "react";
import { Link } from "react-router-dom";

const Rentals = () => {
  const array = [...Array(100)];

  return (
    <div>
      <h1>Rentals</h1>

      {array.map((e, index) => (
        <div key={index}>
          <Link to="/customers">123</Link>
        </div>
      ))}
    </div>
  );
};

export default Rentals;
