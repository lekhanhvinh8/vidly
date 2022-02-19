import { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";

class Form extends Component {
  state = { data: {}, errors: {} };

  handleInputChange = (e) => {
    const data = { ...this.state.data };
    const { currentTarget } = e;

    const errors = { ...this.state.errors };
    const errorMessage = this.validateProp(currentTarget);

    if (errorMessage) errors[currentTarget.name] = errorMessage;
    else delete errors[currentTarget.name];

    data[currentTarget.name] = currentTarget.value;

    this.setState({ data, errors });
  };

  validate = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(this.state.data, this.schema, options);

    if (!result.error) return null;

    const errors = {};
    result.error.details.map((error) => {
      errors[error.path[0]] = error.message;
      return null;
    });

    return errors;
  };

  validateProp = (input) => {
    const obj = { [input.name]: input.value };
    const schema = { [input.name]: this.schema[input.name] };

    const result = Joi.validate(obj, schema);

    return result.error ? result.error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;
  };

  renderButton = (label, { ...props }) => {
    return (
      <button disabled={this.validate()} {...props}>
        {label}
      </button>
    );
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;
    return (
      <Input
        name={name}
        label={label}
        value={data[name]}
        type={type}
        errorMessage={errors[name]}
        onInputChange={this.handleInputChange}
      />
    );
  };
}

export default Form;
