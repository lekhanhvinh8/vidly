import { Component } from "react";
import { logout } from "../services/authService";

class Logout extends Component {
  state = {};
  constructor() {
    super();
    logout();
    window.location = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
