import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./AppNavbar.css";

export default class AppNav extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="skipLink">
          <a href="#mainContent">Skip to Main Content</a>
        </div>
        <nav className="navbar navbar-expand-sm navbar-light border-bottom justify-content-between">
          <Link className="navbar-brand" to="/">
            LiveApp
          </Link>
          <div className="navbar-nav">
            <Link className="nav-item nav-link active" to="/">
              Dashboard
            </Link>
            <Link className="nav-item nav-link active" to="users">
              Users
            </Link>
            <Link className="nav-item nav-link active" to="unicorns">
              Unicorns
            </Link>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
