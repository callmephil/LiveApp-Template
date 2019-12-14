import React, { Component } from "react";
import UnicornsContext, {
  MyUnicornsContext
} from "../Services/UnicornsContextServices";
import Table from "../Components/Table/Table";

class UnicornsCreateForm extends Component {
  static contextType = MyUnicornsContext;
  state = {
    unicorn_id: null,
    name: "",
    age: 1,
    color: "White",
    creation_date: ""
  };

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
    this.setState({
      unicorn_id: null,
      name: "",
      age: 1,
      color: "White",
      creation_date: ""
    });
    if (this.context.state.isEditMode) this.context._ClearEditMode();
  };

  onChangeValue = event => {
    const { name, value, type } = event.target;
    if (!value) return null;

    if (type === "number") this.setState({ [name]: Number(value) });
    else this.setState({ [name]: value });
  };

  componentDidUpdate = () => {
    this.toggleEditMode();
  };

  toggleEditMode = () => {
    const { isEditMode, editData } = this.context.state;
    if (isEditMode)
      if (editData.unicorn_id !== this.state.unicorn_id)
        this.setState({ ...editData });
  };

  render() {
    const { name, age, color } = this.state;
    return (
      <form
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
            onChange={this.onChangeValue}
            value={name}
            required
          />
        </div>
        <div className="form-group">
          <input
            required
            name="age"
            value={age}
            type="number"
            pattern="[0-9]{1,5}"
            min={1}
            placeholder="Age..."
            className="form-control"
            onChange={this.onChangeValue}
          />
        </div>
        <div className="form-group">
          <select
            value={color}
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

export default class Unicorns extends Component {
  render() {
    return (
      <UnicornsContext>
        <div className="container-fluid">
          <h1> Unicorns </h1>
          <div className="row">
            <div className="col-8">
              <MyUnicornsContext.Consumer>
                {context => (
                  <Table
                    list={context.state.list}
                    _fnGet={context._GetByID}
                    _fnDelete={context._DeleteByID}
                    _fnReset={context._Reset}
                    isLoading={context.state.isLoading}
                    structure={["ID", "name", "age", "color", "creation date"]}
                    isEditMode={true}
                    title="Precious List Of Existing Users"
                  />
                )}
              </MyUnicornsContext.Consumer>
            </div>
            <div className="col-4">
              <h3 className="blockquote text-center"> C.R.U.D </h3>
              <UnicornsCreateForm />
            </div>
          </div>
        </div>
      </UnicornsContext>
    );
  }
}
