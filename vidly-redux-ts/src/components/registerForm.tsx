import React from "react";
import Form, { FormState } from "./common/form";
import Joi from "joi";
import { register } from "../services/userService";
import auth from "../services/authService";

interface State extends FormState {}
interface Props {}

class RegisterForm extends Form<Props> {
  state: State = {
    data: { userName: "", password: "", name: "" },
    errors: {},
  };

  schema = Joi.object().keys({
    userName: Joi.string()
      .required()
      .label("User Name")
      .email({ minDomainSegments: 2, tlds: { allow: ["com"] } }),
    password: Joi.string().min(5).required().label("Password"),
    name: Joi.string().required().label("Name"),
  });

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.doSubmit}>
          {this.renderInput("userName", "UserName", this.schema)}
          {this.renderInput("password", "Password", this.schema, "password")}
          {this.renderInput("name", "Name", this.schema)}

          {this.renderButton("Register", this.schema, {
            className: "btn btn-primary",
          })}
        </form>
      </div>
    );
  }

  doSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    this.handleSubmit(this.schema)(e);

    try {
      const response = await register(this.state.data).catch((ex) => {
        if (ex.response && ex.response.status === 400) {
          const errors = { ...this.state.errors };
          errors.userName = ex.response.data;
          this.setState({ errors });
        }
      });

      if (response) {
        const jwt = response.headers["x-auth-token"];
        auth.loginWithJwt(jwt);
        window.location.href = "/";
      }
    } catch (ex) {}
  };
}

export default RegisterForm;
