import React, { PureComponent } from "react";
import AxiosUtils from "./AxiosUtils";

export const MyUnicornsContext = React.createContext(null);

class UnicornsContext extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      editData: null,
      isLoading: true,
      isEditMode: false
    };

    const setIsLoading = isLoading => this.setState({ isLoading });
    this.AxiosUtils = new AxiosUtils(setIsLoading, "unicorns");
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
          el["unicorn_id"] === id ? { ...el, ...data } : el
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
        list: state.list.filter(data => data.unicorn_id !== id)
      };
    });
  };

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

    this.AxiosUtils.onUpdate(unicorn_id, data, cancelToken).then(() => {});
  };

  _DeleteByID = unicorn_id => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    this.AxiosUtils.onDelete(unicorn_id, cancelToken).then(() => {});
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
