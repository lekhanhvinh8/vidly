import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import Input from "../common/input";
import Joi from "joi";
import { Location } from "history";

export interface FormState {
  data: {
    [key: string]: any;
  };
  errors: {
    [key: string]: any;
  };
}

interface MatchParams {
  [key: string]: string;
}

type LocationState = {
  from: Location;
};

class Form<T> extends Component<
  RouteComponentProps<MatchParams, StaticContext, LocationState> & T
> {
  state: FormState = { data: {}, errors: {} };

  handleInputChange =
    (schema: Joi.ObjectSchema<any>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const data = { ...this.state.data };
      const { currentTarget } = e;

      const errors = { ...this.state.errors };
      const errorMessage = this.validateProp(currentTarget, schema);

      if (errorMessage) errors[currentTarget.name] = errorMessage;
      else delete errors[currentTarget.name];

      data[currentTarget.name] = currentTarget.value;

      this.setState({ data, errors });
    };

  validate = (schema: Joi.ObjectSchema<any>) => {
    const options = { abortEarly: false };
    //const result = Joi.validate(this.state.data, schema, options);
    //const result = Joi.valid(this.state.data, schema, options);
    const result = schema.validate(this.state.data, options);

    if (!result.error) return null;

    const errors: { [key: string]: any } = {};
    result.error.details.map((error) => {
      errors[error.path[0]] = error.message;
      return null;
    });

    return errors;
  };

  validateProp = (
    input: EventTarget & HTMLInputElement,
    schema: Joi.ObjectSchema<any>
  ) => {
    const obj = { [input.name]: input.value };
    const propSchema = schema.label(input.name);

    const result = propSchema.validate(obj);

    return result.error ? result.error.details[0].message : null;
  };

  handleSubmit =
    (schema: Joi.ObjectSchema<any>) =>
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const errors = this.validate(schema);
      this.setState({ errors: errors || {} });

      if (errors) return;
    };

  renderButton = (
    label: string,
    schema: Joi.ObjectSchema<any>,
    { ...props }
  ) => {
    return (
      <button disabled={this.validate(schema) ? true : false} {...props}>
        {label}
      </button>
    );
  };

  renderInput = (
    name: string,
    label: string,
    schema: Joi.ObjectSchema<any>,
    type: string = "text"
  ) => {
    const { data, errors } = this.state;
    return (
      <Input
        name={name}
        label={label}
        value={data[name]}
        type={type}
        errorMessage={errors[name]}
        onInputChange={this.handleInputChange(schema)}
      />
    );
  };
}

export default Form;
