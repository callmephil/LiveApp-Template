import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AppNav from "./AppNav";
import "./App.css";
import Dashboard from "../Pages/Dashboard";
import Unicorns from "../Pages/Unicorns";
import Users from "../Pages/Users";

class App extends Component {
  render() {
    return (
      <React.Fragment>
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
