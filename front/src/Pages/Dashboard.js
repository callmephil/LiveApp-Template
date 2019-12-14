import React, { Component } from "react";
import "../Layout/form.css";
import UnicornsContext, {
  MyUnicornsContext
} from "../Services/UnicornsContextServices";
import Table from "../Components/Table/Table";
import UsersContext, { MyUsersContext } from "../Services/UsersContextServices";

export default class Dashboard extends Component {
  RenderUnicornTable = () => (
    <UnicornsContext>
      <MyUnicornsContext.Consumer>
        {context => (
          <Table
            list={context.state.list}
            _fnGet={context._GetByID}
            _fnDelete={context._DeleteByID}
            _fnReset={context._Reset}
            isLoading={context.state.isLoading}
            title={"Precious List Of Existing Unicorns"}
            structure={["ID", "name", "age", "color", "creation date"]}
          />
        )}
      </MyUnicornsContext.Consumer>
    </UnicornsContext>
  );

  RenderUserTable = () => (
    <UsersContext>
      <MyUsersContext.Consumer>
        {context => (
          <Table
            list={context.state.list}
            _fnGet={context._GetByID}
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
            _fnReset={context._Reset}
          />
        )}
      </MyUsersContext.Consumer>
    </UsersContext>
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
