import React, { Component } from "react";
import Table from "../Components/Table/Table";
import Context, { MyContext } from "../Services/MyContextServices";
import { setFormDefaultValue } from "../Utils/FormHandler";
import { debounceEvent } from '../Utils/Delayer';

class UnicornsCreateForm extends Component {
  static contextType = MyContext;
  state = {
    unicorn_id: null,
    name: "",
    age: 1,
    color: "White",
    creation_date: ""
  };
  refForm = React.createRef();
  refDebounce = React.createRef();

  handleSumbit = event => {
    event.preventDefault();
    const { unicorn_id, name, age, color } = this.state;
    if (this.context.state.isEditMode)
      this.context._UpdateByID(unicorn_id, { name, age, color });
    else {
      this.context._Create({ name, age, color });
    }
  };

  handleReset = event => {
    event.preventDefault();
    const defaultState = {
      unicorn_id: null,
      name: "",
      age: 1,
      color: "White",
      creation_date: ""
    };
    this.setState({ ...defaultState });
    setFormDefaultValue(defaultState, this.refForm);
    if (this.context.state.isEditMode) this.context._ClearEditMode();
  };

  onChangeValue = event => {
    const { name, value, type } = event.target;

    if (type === "number") this.setState({ [name]: Number(value) });
    else this.setState({ [name]: value });
  };

  componentDidUpdate = () => {
    this.toggleEditMode();
  };

  componentWillUnmount = () => {
    if (this.refDebounce.current)
      this.refDebounce.current.cancel();
  }

  toggleEditMode = () => {
    const { isEditMode, editData } = this.context.state;
    if (isEditMode)
      if (editData.unicorn_id !== this.state.unicorn_id) {
        this.setState({ ...editData });
        setFormDefaultValue(editData, this.refForm);
      }
  };

  render() {
    const { unicorn_id } = this.state;
    const isSubmitOrEditLabel = unicorn_id
      ? `Edit - ID: ${unicorn_id}`
      : "Submit";
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
            name="name"
            placeholder="Name..."
            className="form-control"
            onChange={debounceEvent(this.refDebounce, this.onChangeValue)}
            required
          />
        </div>
        <div className="form-group">
          <input
            required
            name="age"
            type="number"
            pattern="[0-9]{1,5}"
            min={1}
            placeholder="Age..."
            className="form-control"
            onChange={debounceEvent(this.refDebounce, this.onChangeValue)}
          />
        </div>
        <div className="form-group">
          <select
            name="color"
            className="form-control"
            onChange={this.onChangeValue}
          >
            <option value="White">White</option>
            <option value="Blue">Blue</option>
            <option value="Pink">Pink</option>
            <option value="Zebra">Zebra</option>
            <option value="Gold">Gold</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-success btn-lg btn-block btn-sm"
          disabled={this.context.state.isLoading}
        >
          {isSubmitOrEditLabel}
        </button>
        <button
          type="reset"
          className="btn btn-warning btn-lg btn-block btn-sm"
          disabled={this.context.state.isLoading}
        >
          Clear
        </button>
      </form>
    );
  }
}

export default class Unicorns extends Component {
  render() {
    return (
      <Context
        isViewMode={false}
        route={"unicorns"}
        primaryID="unicorn_id"
        toastIcon={"🦄"}
      >
        <div className="container-fluid">
          <h1> Unicorns </h1>
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
                    structure={["ID", "name", "age", "color", "creation date"]}
                    isEditMode={true}
                    title="Precious List Of Existing Unicorns"
                  />
                )}
              </MyContext.Consumer>
            </div>
            <div className="col-4">
              <h3 className="blockquote text-center"> C.R.U.D </h3>
              <UnicornsCreateForm />
            </div>
          </div>
        </div>
      </Context>
    );
  }
}
