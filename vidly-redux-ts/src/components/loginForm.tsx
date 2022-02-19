import React from "react";
import Joi from "joi";
import { Redirect } from "react-router-dom";
import Form, { FormState } from "./common/form";
import { login, getCurrentUser } from "../services/authService";

interface Props {}

class LoginForm extends Form<Props> {
  state: FormState = {
    data: { userName: "", password: "" },
    errors: {},
  };

  schema = Joi.object().keys({
    userName: Joi.string().required().label("User Name"),
    password: Joi.string().required().label("Password"),
  });

  render() {
    if (getCurrentUser()) return <Redirect to="/" />;

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.doSubmit}>
          {this.renderInput("userName", "UserName", this.schema)}
          {this.renderInput("password", "Password", this.schema, "password")}
          {this.renderButton("Login", this.schema, {
            name: "abc",
            className: "btn btn-primary",
          })}
        </form>
      </div>
    );
  }

  doSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    this.handleSubmit(this.schema)(e);
    const { state } = this.props.location;

    try {
      const { userName, password } = this.state.data;
      await login(userName, password).catch((error) => {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa", error);
      });
      window.location.href = state ? state.from.pathname : "/";
    } catch (ex) {
      // if (ex.response && ex.response.status === 400) {
      //   const errors = { ...this.state.errors };
      //   errors.userName = ex.response.data;
      //   this.setState({ errors });
      // }
      // console.log(ex);
    }
  };
}

export default LoginForm;
