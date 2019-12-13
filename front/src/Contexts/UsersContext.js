import React, { PureComponent } from "react";
import AxiosUtils from "../Services/AxiosUtils";

export const MyUsersContext = React.createContext(null);

class UsersContext extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      list: [],
      isEditMode: false,
      editData: null
    };

    const setIsLoading = isLoading => this.setState({ isLoading });
    this.AxiosUtils = new AxiosUtils(setIsLoading);
    this.io = this.AxiosUtils.socket;
    this.io.on("onChangeData", () => this.fetchList());
  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnmount() {
    this.io.off("onChangeData");
  }

  fetchList() {
    const cancelToken = this.AxiosUtils.getCancelToken();
    // sleep(1500).then(() =>
      this.AxiosUtils.onGetAll(null, cancelToken).then(result => {
        this.setState({ list: result.data.result });
      })
    // );
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

    this.AxiosUtils.onUpdate(user_id, data, cancelToken).then(result => {
      if (result.status === 200) {
        this.setState(state => {
          return {
            list: state.list.map(el =>
              el["user_id"] === user_id ? { ...el, ...data } : el
            )
          };
        });
      } else console.log(result);
    });
  };

  _DeleteByID = user_id => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onDelete(user_id, cancelToken).then(result => {
      this.setState(state => {
        return {
          list: state.list.filter(user => user.user_id !== user_id)
        };
      });
    });
  };

  _Create = data => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onCreate(data, cancelToken).then(result => {
      if (result.statusText === "Created") {
        this.setState(state => {
          return { list: [...state.list, result.data] };
        });
      } else console.log(result);
    });
  };

  render() {
    const {
      state,
      _GetByID,
      _UpdateByID,
      _DeleteByID,
      _Create,
      _ClearEditMode
    } = this;
    return (
      <MyUsersContext.Provider
        value={{
          state,
          _Create,
          _GetByID,
          _UpdateByID,
          _DeleteByID,
          _ClearEditMode
        }}
      >
        {this.props.children}
      </MyUsersContext.Provider>
    );
  }
}

export default UsersContext;
