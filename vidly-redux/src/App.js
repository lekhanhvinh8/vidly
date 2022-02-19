import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import Movies from "./components/movies";
import NavBar from "./components/navbar";
import NotFound from "./components/notfount";
import Customers from "./components/customers";
import Rentals from "./components/Rentals";
import MovieForm from "./components/movieForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";
import ProtectedRoute from "./components/Common/protectedRoute";
import auth from "./services/authService";
import configureStore from "./store/store";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Test from "./components/test";

class App extends Component {
  state = {};

  constructor() {
    super();
    this.state.user = auth.getCurrentUser();
  }

  componentDidMount() {}

  render() {
    const { user } = this.state;
    const store = configureStore();

    return (
      <main className="container">
        <Provider store={store}>
          <ToastContainer />
          <NavBar user={user} />
          <div style={{ marginTop: 20 }}></div>
          <Switch>
            <Route path="/login" exact component={LoginForm} />
            <Route path="/register" exact component={RegisterForm} />
            <Route path="/logout" exact component={Logout} />
            <Route
              path="/movies/new"
              exact
              render={(props) => {
                console.log("movies/new", props);
                return user ? (
                  <MovieForm customProp="abc" {...props} />
                ) : (
                  <Redirect to="/login" />
                );
              }}
            />
            <ProtectedRoute
              path="/movies/:movieId"
              exact
              render={(props) => {
                console.log("movies/id", props);
                return <MovieForm customProp="efg" {...props} />;
              }}
            />
            <Route path="/test" exact component={Test} />
            <Route
              path="/movies"
              exact
              render={(props) => <Movies user={user} {...props} />}
            />
            <Route path="/customers" exact component={Customers} />
            <Route path="/rentals" exact component={Rentals} />
            <Route path="/not-found" exact component={NotFound} />
            <Route path="/" exact component={() => <Redirect to="/movies" />} />
            <Redirect to="/not-found" />
          </Switch>
        </Provider>
      </main>
    );
  }
}

export default App;
