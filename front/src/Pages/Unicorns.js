import React, { Component } from "react";

const Form = () => (
  <form className="create-form">
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Email address</label>
      <input
        type="email"
        className="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Enter email"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="exampleInputPassword1">Password</label>
      <input
        type="password"
        className="form-control"
        id="exampleInputPassword1"
        placeholder="Password"
        required
      />
    </div>
    <button type="submit" className="btn btn-primary">
      Submit
    </button>
  </form>
);

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

export default class Unicorns extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
        <div className="col">
            <h3 className="blockquote text-center"> C.R.U.D </h3>
            <Form />
          </div>
          <div className="col">
            <h3 className="blockquote text-center"> PRECIOUS LIST OF EXISTING UNICORNS </h3>
            <Table />
          </div>
        </div>
      </div>
    );
  }
}
