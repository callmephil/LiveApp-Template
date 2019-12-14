import React, { Component } from "react";
import UsersContext, { MyUsersContext } from "../Services/UsersContextServices";

class UsersList extends Component {
  static contextType = MyUsersContext;
  GetColumnData = () => {
    const { state, _GetByID, _DeleteByID } = this.context;
    return state.list.map(element => {
      const { user_id, first_name, last_name, email, creation_date } = element;
      return (
        <tr key={user_id}>
          <td>{user_id}</td>
          <td>{first_name}</td>
          <td>{last_name}</td>
          <td>{email}</td>
          <td>{creation_date}</td>
          <td>
            <div className="container-fluid">
              <div className="row">
                <div className="col-6">
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => _GetByID(user_id)}
                  >
                    EDIT
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => _DeleteByID(user_id)}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  render() {
    if (this.context.state.isLoading)
      return <h3 className="table-fill"> Loading Table Data... </h3>;

    return (
      <div className="table-responsive">
        <table className="table table-hover table-dark">
          <thead style={{ textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Creation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }} className="table-hover">
            <this.GetColumnData />
          </tbody>
        </table>
      </div>
    );
  }
}

class UsersCreateForm extends Component {
  static contextType = MyUsersContext;
  state = {
    user_id: null,
    first_name: "",
    last_name: "",
    email: "",
    creation_date: ""
  };

  handleSumbit = event => {
    event.preventDefault();
    const { user_id, first_name, last_name, email } = this.state;
    if (this.context.state.isEditMode)
      this.context._UpdateByID(user_id, { first_name, last_name, email });
    else {
      this.context._Create({ first_name, last_name, email });
    }
  };

  handleReset = event => {
    event.preventDefault();
    this.setState({
      user_id: null,
      first_name: "",
      last_name: "",
      email: "",
      creation_date: ""
    });
    if (this.context.state.isEditMode) this.context._ClearEditMode();
  };

  onChangeValue = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  componentDidUpdate = () => {
    this.toggleEditMode();
  };

  toggleEditMode = () => {
    const { isEditMode, editData } = this.context.state;
    if (isEditMode)
      if (editData.user_id !== this.state.user_id)
        this.setState({ ...editData });
  };

  render() {
    const { first_name, last_name, email } = this.state;
    return (
      <form
        className="create-form"
        onSubmit={this.handleSumbit}
        onReset={this.handleReset}
      >
        <div className="form-group">
          {/* <label htmlFor="fname">First Name</label> */}
          <input
            type="text"
            id="fname"
            name="first_name"
            placeholder="First Name..."
            className="form-control"
            onChange={this.onChangeValue}
            value={first_name}
            required
          />
        </div>
        <div className="form-group">
          {/* <label htmlFor="flast">Last Name</label> */}
          <input
            id="flast"
            required
            name="last_name"
            type="text"
            value={last_name}
            placeholder="Last Name..."
            className="form-control"
            onChange={this.onChangeValue}
          />
        </div>
        <div className="form-group">
          {/* <label htmlFor="femail">Email</label> */}
          <input
            id="femail"
            required
            name="email"
            type="text"
            value={email}
            placeholder="Email..."
            className="form-control"
            onChange={this.onChangeValue}
          />
        </div>

        <button
          type="submit"
          value="Submit"
          className="btn btn-success btn-lg btn-block btn-sm"
        >
          Submit
        </button>
        <button
          type="reset"
          value="Reset"
          className="btn btn-warning btn-lg btn-block btn-sm"
        >
          Clear
        </button>
      </form>
    );
  }
}

export default class Users extends Component {
  render() {
    return (
      <UsersContext>
        <h1> Users </h1>
        <div className="container-fluid">
          <div className="row">
            <div className="col-8">
              <h3 className="blockquote text-center">
                PRECIOUS LIST OF EXISTING USERS
              </h3>
              <UsersList />
            </div>
            <div className="col-4">
              <h3 className="blockquote text-center"> C.R.U.D </h3>
              <UsersCreateForm />
            </div>
          </div>
        </div>
      </UsersContext>
    );
  }
}
