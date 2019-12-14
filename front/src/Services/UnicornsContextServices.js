import React, { PureComponent } from "react";
import AxiosUtils from "./AxiosUtils";

export const MyUnicornsContext = React.createContext(null);

class UnicornsContext extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      list: [],
      isEditMode: false,
      editData: null
    };

    const setIsLoading = isLoading => this.setState({ isLoading });
    this.AxiosUtils = new AxiosUtils(setIsLoading, "unicorns");
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
      if (result.data.result) this.setState({ list: result.data.result });
    });
    // );
  }

  _GetByID = unicorn_id => {
    const result = this.state.list.find(
      unicorn => unicorn.unicorn_id === unicorn_id
    );
    if (result) this.setState({ isEditMode: true, editData: result });
  };

  _ClearEditMode = () => {
    this.setState({ isEditMode: false, editData: null });
  };

  _UpdateByID = (unicorn_id, data) => {
    const cancelToken = this.AxiosUtils.getCancelToken();

    this.AxiosUtils.onUpdate(unicorn_id, data, cancelToken).then(result => {
      this.setState(state => {
        return {
          list: state.list.map(el =>
            el["unicorn_id"] === unicorn_id ? { ...el, ...data } : el
          )
        };
      });
    });
  };

  _DeleteByID = unicorn_id => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onDelete(unicorn_id, cancelToken).then(result => {
      this.setState(state => {
        return {
          list: state.list.filter(unicorn => unicorn.unicorn_id !== unicorn_id)
        };
      });
    });
  };

  _Create = data => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onCreate(data, cancelToken).then(result => {
      if (result.data.success) {
        const newRow = { unicorn_id: result.data.lastInsertRowid, ...data };
        this.setState(state => {
          return { list: [...state.list, newRow] };
        });
      }
    });
  };

  _Reset = () => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onReset(cancelToken).then(result => {
      if (result)
        this.setState({list: []});
    })
  }
  render() {
    const {
      state,
      _GetByID,
      _UpdateByID,
      _DeleteByID,
      _Create,
      _Reset,
      _ClearEditMode
    } = this;
    return (
      <MyUnicornsContext.Provider
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
      </MyUnicornsContext.Provider>
    );
  }
}

export default UnicornsContext;
