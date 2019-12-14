import React, { Component } from "react";
import "../Layout/form.css";
import UnicornsContext, {
  MyUnicornsContext
} from "../Services/UnicornsContextServices";
import Table from "../Components/Table/Table";
import UsersContext, { MyUsersContext } from "../Services/UsersContextServices";

export default class Dashboard extends Component {
  RenderUnicornTable = () => (
    <UnicornsContext isViewMode={true}>
      <MyUnicornsContext.Consumer>
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
      </MyUnicornsContext.Consumer>
    </UnicornsContext>
  );

  RenderUserTable = () => (
    <UsersContext isViewMode={true}>
      <MyUsersContext.Consumer>
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
