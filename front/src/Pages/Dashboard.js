import React, { Component } from "react";
import "../Layout/form.css";
import Table from "../Components/Table/Table";
import Context, { MyContext } from "../Services/MyContextServices";

export default class Dashboard extends Component {
  RenderUnicornTable = () => (
    <Context
      isViewMode={true}
      route={"unicorns"}
      primaryID="unicorn_id"
      toastIcon={"🦄"}
    >
      <MyContext.Consumer>
        {context => (
          <Table
            list={context.state.list}
            _fnGet={context._GetByID}
            _fnReset={context._Reset}
            _fnDelete={context._DeleteByID}
            isLoading={context.state.isLoading}
            title={"Precious List Of Existing Unicorns"}
            structure={["ID", "name", "age", "color", "creation date"]}
          />
        )}
      </MyContext.Consumer>
    </Context>
  );

  RenderUserTable = () => (
    <Context
      isViewMode={true}
      route={"users"}
      primaryID="user_id"
      toastIcon={"👤"}
    >
      <MyContext.Consumer>
        {context => (
          <Table
            list={context.state.list}
            _fnGet={context._GetByID}
            _fnReset={context._Reset}
            _fnDelete={context._DeleteByID}
            isLoading={context.state.isLoading}
            structure={[
              "ID",
              "first name",
              "last name",
              "email",
              "creation date"
            ]}
            title={"Precious List Of Existing Users"}
          />
        )}
      </MyContext.Consumer>
    </Context>
  );

  render() {
    return (
      <div className="container-fluid">
        <h1> Dashboard </h1>
        <div className="row">
          <this.RenderUnicornTable />
          <this.RenderUserTable />
        </div>
      </div>
    );
  }
}
