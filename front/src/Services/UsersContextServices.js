import React, { PureComponent } from "react";
import { toast } from "react-toastify";
import AxiosUtils from "./AxiosUtils";

export const MyUsersContext = React.createContext(null);

class UsersContext extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      editData: null,
      isLoading: true,
      isEditMode: false,
      isSingleFetch: false
    };

    const setIsLoading = isLoading => this.setState({ isLoading });
    this.AxiosUtils = new AxiosUtils(setIsLoading, "users");
    this.io = this.AxiosUtils.socket;
    this.cancelToken = this.AxiosUtils.getCancelToken();
  }

  componentDidMount() {
    this.fetchList();
    this.handleSocket(this.props.isViewMode);
  }

  componentWillUnmount() {
    this.io.off("/api/users");
    this.io.off("ERROR");
    this.cancelToken.cancel("Canceling");
  }

  handleSocket(isViewMode) {
    this.io.on("ERROR", message => toast.error(message));
    this.io.on("/api/users", (method, id, data) => {
      if (this.state.isSingleFetch && method !== "DELETE")
        this.handleSingleFetch(parseInt(id));
      else if (isViewMode) this.fetchList();
      else {
        switch (method) {
          case "DELETE":
            this.handleStateDelete(parseInt(id));
            break;
          case "POST":
            this.handleStateCreate(parseInt(id), JSON.parse(data));
            break;
          case "PATCH":
            this.handleStateUpdate(parseInt(id), JSON.parse(data));
            break;
          default:
            console.error(`unknown method ${method}`);
        }
      }
    });
  }

  handleSingleFetch = async id => {
    const result = await this.AxiosUtils.onGet(id, this.cancelToken);
    if (result) {
      const list = this.state.list.map(el =>
        el["users"] === id ? { ...el, ...result.data.result } : el
      );
      this.setState({ list });
    }
  };

  handleStateUpdate = (id, data) => {
    this.setState(state => {
      return {
        list: state.list.map(el =>
          el["user_id"] === id ? { ...el, ...data } : el
        )
      };
    });
    toast(`🦄 ID:${id} Updated`);
  };

  handleStateCreate = (id, data) => {
    const newRow = { unicorn_id: id, ...data };
    this.setState(state => {
      return { list: [...state.list, newRow] };
    });
    toast(`🦄 ID:${id} Created`);
  };

  handleStateDelete = id => {
    this.setState(state => {
      return {
        list: state.list.filter(data => data.user_id !== id)
      };
    });
    toast(`🦄 ID:${id} Deleted`);
  };

  fetchList() {
    this.AxiosUtils.onGetAll(null,this.cancelToken).then(result => {
      if (result.data.result) 
        this.setState({ list: result.data.result });
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

    this.AxiosUtils.onUpdate(user_id, data, this.cancelToken).then(() => {});
  };

  _DeleteByID = user_id => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onDelete(user_id, this.cancelToken).then(() => {});
  };

  _Create = data => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onCreate(data, this.cancelToken).then(() => {});
  };

  _Reset = () => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onReset(this.cancelToken).then(result => {
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
