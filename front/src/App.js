import React, { Component } from "react";
import UsersContext, { MyUsersContext } from "./Contexts/UsersContext";
import "./Layout/table.css";
import "./Layout/grid.css";
import "./Layout/form.css";

class UsersList extends Component {
  static contextType = MyUsersContext;
  GetColumnData = () => {
    const { state, _GetByID, _DeleteByID } = this.context;
    return state.list.map(element => {
      const { user_id, first_name, last_name, email, creation_date } = element;
      return (
        <tr key={user_id}>
          <td className="text-left">{user_id}</td>
          <td className="text-left">{first_name}</td>
          <td className="text-left">{last_name}</td>
          <td className="text-left">{email}</td>
          <td className="text-left">{creation_date}</td>
          <td className="text-left">
            <button onClick={() => _GetByID(user_id)}>EDIT</button>
            <button onClick={() => _DeleteByID(user_id)}>DELETE</button>
          </td>
        </tr>
      );
    });
  };

  render() {
    if (this.context.state.isLoading)
      return <h3 className="table-fill"> Loading Table Data... </h3>

    return (
      <table className="table-fill">
        <thead>
          <tr>
            <th className="text-left">ID</th>
            <th className="text-left">First Name</th>
            <th className="text-left">Last Name</th>
            <th className="text-left">Email</th>
            <th className="text-left">Creation Date</th>
            <th className="text-left">Action</th>
          </tr>
        </thead>
        <tbody className="table-hover">
          <this.GetColumnData />
        </tbody>
      </table>
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
      this.context._Create({first_name, last_name, email})
    };
  };

  handleReset = event => {
    event.preventDefault();
    this.setState({     user_id: null,
      first_name: "",
      last_name: "",
      email: "",
      creation_date: "" });
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
        <label htmlFor="fname">First Name</label>
        <input
          type="text"
          id="fname"
          name="first_name"
          placeholder="First Name..."
          onChange={this.onChangeValue}
          value={first_name}
          required
        />
        <label htmlFor="flast">Last Name</label>
        <input
          id="flast"
          required
          name="last_name"
          type="text"
          value={last_name}
          placeholder="Last Name..."
          onChange={this.onChangeValue}
        />
        <label htmlFor="femail">Email</label>
        <input
          id="femail"
          required
          name="email"
          type="text"
          value={email}
          placeholder="Email..."
          onChange={this.onChangeValue}
        />

        <button type="submit" value="Submit">
          Submit
        </button>
        <button type="reset" value="Reset">
          Clear
        </button>
      </form>
    );
  }
}

class App extends Component {
  render() {
    return (
      <UsersContext>
        <div className="grid-container">
          <section>
            <div className="table-title" style={{ textAlign: "center" }}>
              <h3>Precious List of existing Userss</h3>
            </div>
            <UsersList />
          </section>
          <section>
            <div className="table-title" style={{ textAlign: "center" }}>
              <h3>C.R.U.D</h3>
            </div>
            <UsersCreateForm />
          </section>
        </div>
      </UsersContext>
    );
  }
}

export default App;
