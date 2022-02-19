import { Component } from "react";
import { logout } from "../services/authService";

class Logout extends Component {
  state = {};
  constructor(props: any) {
    super(props);
    logout();
    window.location.href = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
