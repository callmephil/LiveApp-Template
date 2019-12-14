import React, { Component } from "react";
import "../Layout/form.css";

const Table = () => (
  <div className="table-responsive">
    <table className="table table-hover table-dark">
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Creation Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>@mdo</td>
        </tr>
      </tbody>
    </table>
  </div>
);


export default class Dashboard extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h3 className="blockquote text-center"> USERS </h3>
            <Table />
          </div>
          <div className="col">
            <h3 className="blockquote text-center"> UNICORNS </h3>
            <Table />
          </div>
        </div>
      </div>
    );
  }
}
