import React from "react";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import Form from "./Common/form";
import { login, getCurrentUser } from "../services/authService";

class LoginForm extends Form {
  state = {
    data: { userName: "", password: "" },
    errors: {},
  };

  schema = {
    userName: Joi.string().required().label("User Name"),
    password: Joi.string().required().label("Password"),
  };

  render() {
    if (getCurrentUser()) return <Redirect to="/" />;

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.doSubmit}>
          {this.renderInput("userName", "UserName")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login", {
            name: "abc",
            className: "btn btn-primary",
          })}
        </form>
      </div>
    );
  }

  doSubmit = async (e) => {
    this.handleSubmit(e);
    const { state } = this.props.location;

    try {
      const { userName, password } = this.state.data;
      await login(userName, password);

      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.userName = ex.response.data;
        this.setState({ errors });
      }
    }
  };
}

export default LoginForm;
