import React from "react";
import Form from "./Common/form";
import Joi from "joi-browser";
import { register } from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: { userName: "", password: "", name: "" },
    errors: {},
  };

  schema = {
    userName: Joi.string()
      .required()
      .label("User Name")
      .email({ minDomainSegments: 2, tlds: { allow: ["com"] } }),
    password: Joi.string().min(5).required().label("Password"),
    name: Joi.string().required().label("Name"),
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.doSubmit}>
          {this.renderInput("userName", "UserName")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}

          {this.renderButton("Register", { className: "btn btn-primary" })}
        </form>
      </div>
    );
  }

  doSubmit = async (e) => {
    this.handleSubmit(e);

    try {
      const response = await register(this.state.data);
      const jwt = response.headers["x-auth-token"];
      auth.loginWithJwt(jwt);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.userName = ex.response.data;
        this.setState({ errors });
      }
    }
  };
}

export default RegisterForm;
