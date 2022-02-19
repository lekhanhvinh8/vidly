import React from "react";

const Input = ({ name, label, errorMessage, onInputChange, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="control-label">
        {label}
      </label>
      <input
        {...rest}
        name={name}
        className="form-control"
        id={name}
        onChange={onInputChange}
      />
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    </div>
  );
};

export default Input;
