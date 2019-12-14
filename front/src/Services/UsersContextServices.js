import React, { PureComponent } from "react";
import AxiosUtils from "./AxiosUtils";

export const MyUsersContext = React.createContext(null);

class UsersContext extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      editData: null,
      isLoading: true,
      isEditMode: false
    };

    const setIsLoading = isLoading => this.setState({ isLoading });
    this.AxiosUtils = new AxiosUtils(setIsLoading, "users");
    this.io = this.AxiosUtils.socket;
  }

  componentDidMount() {
    this.fetchList();
    if (this.props.isViewMode) {
      this.io.on("RE_FETCH", () => this.fetchList());
    } else {
      this.handleSocket();
    }
  }

  componentWillUnmount() {
    this.io.off("RE_FETCH");
    this.io.off("DELETE");
    this.io.off("CREATE");
    this.io.off("UPDATE");
  }

  handleSocket() {
    this.io.on("DELETE", id => this.handleStateDelete(parseInt(id)));
    this.io.on("CREATE", (id, data) =>
      this.handleStateCreate(parseInt(id), JSON.parse(data))
    );
    this.io.on("UPDATE", data => this.handleStateUpdate(JSON.parse(data)));
  }

  handleStateUpdate = data => {
    const id = parseInt(data.id);
    delete data.id; // !!! Any other way ?
    this.setState(state => {
      return {
        list: state.list.map(el =>
          el["user_id"] === id ? { ...el, ...data } : el
        )
      };
    });
  };

  handleStateCreate = (id, data) => {
    const newRow = { unicorn_id: id, ...data };
    this.setState(state => {
      return { list: [...state.list, newRow] };
    });
  };

  handleStateDelete = id => {
    this.setState(state => {
      return {
        list: state.list.filter(data => data.user_id !== id)
      };
    });
  };

  fetchList() {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onGetAll(null, cancelToken).then(result => {
      if (result.data.result) this.setState({ list: result.data.result });
    });
  }

  _GetByID = user_id => {
    const result = this.state.list.find(user => user.user_id === user_id);
    if (result) this.setState({ isEditMode: true, editData: result });
  };

  _ClearEditMode = () => {
    this.setState({ isEditMode: false, editData: null });
  };

  _UpdateByID = (user_id, data) => {
    const cancelToken = this.AxiosUtils.getCancelToken();

    this.AxiosUtils.onUpdate(user_id, data, cancelToken).then(() => {});
  };

  _DeleteByID = user_id => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onDelete(user_id, cancelToken).then(() => {});
  };

  _Create = data => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onCreate(data, cancelToken).then(() => {});
  };

  _Reset = () => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onReset(cancelToken).then(result => {
      if (result) this.setState({ list: [] });
    });
  };

  render() {
    const {
      state,
      _GetByID,
      _UpdateByID,
      _DeleteByID,
      _Create,
      _ClearEditMode,
      _Reset
    } = this;
    return (
      <MyUsersContext.Provider
        value={{
          state,
          _Create,
          _GetByID,
          _UpdateByID,
          _DeleteByID,
          _ClearEditMode,
          _Reset
        }}
      >
        {this.props.children}
      </MyUsersContext.Provider>
    );
  }
}

export default UsersContext;
