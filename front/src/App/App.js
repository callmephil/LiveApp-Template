import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AppNav from "./AppNav";
import "./App.css";
import Dashboard from "../Pages/Dashboard";
import Unicorns from "../Pages/Unicorns";
import Users from "../Pages/Users";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer
          draggable
          newestOnTop
          autoClose={1500}
          closeOnClick={false}
          pauseOnHover={false}
          position="bottom-left"
        />
        <AppNav />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/users" component={Users} />
          <Route path="/unicorns" component={Unicorns} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
