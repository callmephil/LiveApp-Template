import React, { Component } from "react";
import UsersContext, { MyUsersContext } from "../Services/UsersContextServices";
import Table from "../Components/Table/Table";

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
    const { first_name, last_name, email, user_id } = this.state;
    const isSubmitOrEditLabel = user_id ? `Edit - ID: ${user_id}` : "Submit";
    return (
      <form
        className="create-form"
        onSubmit={this.handleSumbit}
        onReset={this.handleReset}
      >
        <div className="form-group">
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
          className="btn btn-success btn-lg btn-block btn-sm"
        >
          {isSubmitOrEditLabel}
        </button>
        <button
          type="reset"
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
      <UsersContext isViewMode={false}>
        <div className="container-fluid">
          <h1> Users </h1>
          <div className="row">
            <div className="col-8">
              <MyUsersContext.Consumer>
                {context => (
                  <Table
                    list={context.state.list}
                    _fnGet={context._GetByID}
                    _fnDelete={context._DeleteByID}
                    _fnReset={context._Reset}
                    isLoading={context.state.isLoading}
                    structure={[
                      "ID",
                      "first name",
                      "last name",
                      "email",
                      "creation date"
                    ]}
                    isEditMode={true}
                    title="Precious List Of Existing Users"
                  />
                )}
              </MyUsersContext.Consumer>
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
