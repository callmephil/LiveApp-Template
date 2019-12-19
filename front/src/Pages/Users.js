import React, { Component } from "react";
import Table from "../Components/Table/Table";
import Context, { MyContext } from "../Services/MyContextServices";
import { debounceEvent } from "../Utils/Delayer";
import { setFormDefaultValue } from "../Utils/FormHandler";

class UsersCreateForm extends Component {
  static contextType = MyContext;
  state = {
    user_id: null,
    first_name: "",
    last_name: "",
    email: "",
    creation_date: ""
  };
  refDebounce = React.createRef();
  refForm = React.createRef();

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
    const obj = {
      user_id: null,
      first_name: "",
      last_name: "",
      email: "",
      creation_date: ""
    };
    this.setState({ ...obj });
    setFormDefaultValue(this.refForm, obj);
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
      if (editData.user_id !== this.state.user_id) {
        this.setState({ ...editData });
        setFormDefaultValue(this.refForm, editData);
      }
  };

  render() {
    const { user_id } = this.state;
    const isSubmitOrEditLabel = user_id ? `Edit - ID: ${user_id}` : "Submit";
    return (
      <form
        ref={this.refForm}
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
            onChange={debounceEvent(this.refDebounce, this.onChangeValue)}
            required
          />
        </div>
        <div className="form-group">
          <input
            id="flast"
            required
            name="last_name"
            type="text"
            placeholder="Last Name..."
            className="form-control"
            onChange={debounceEvent(this.refDebounce, this.onChangeValue)}
          />
        </div>
        <div className="form-group">
          <input
            id="femail"
            required
            name="email"
            type="text"
            placeholder="Email..."
            className="form-control"
            onChange={debounceEvent(this.refDebounce, this.onChangeValue)}
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
      <Context
        isViewMode={false}
        route={"users"}
        primaryID="user_id"
        toastIcon={"👤"}
      >
        <div className="container-fluid">
          <h1> Users </h1>
          <div className="row">
            <div className="col-8">
              <MyContext.Consumer>
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
              </MyContext.Consumer>
            </div>
            <div className="col-4">
              <h3 className="blockquote text-center"> C.R.U.D </h3>
              <UsersCreateForm />
            </div>
          </div>
        </div>
      </Context>
    );
  }
}
