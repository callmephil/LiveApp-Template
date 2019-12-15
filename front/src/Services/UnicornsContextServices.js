import React, { PureComponent } from "react";
import { toast } from "react-toastify";
import AxiosUtils from "./AxiosUtils";

export const MyUnicornsContext = React.createContext(null);

class UnicornsContext extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      editData: null,
      isLoading: true,
      isEditMode: false,
      isSingleFetch: true,
    };

    const setIsLoading = isLoading => this.setState({ isLoading });
    this.AxiosUtils = new AxiosUtils(setIsLoading, "unicorns");
    this.io = this.AxiosUtils.socket;
  }

  componentDidMount() {
    this.fetchList();
    this.handleSocket(this.props.isViewMode);
  }

  componentWillUnmount() {
    this.io.off("/api/unicorns");
    this.io.off("ERROR");
  }

  handleSocket(isViewMode) {
    this.io.on("ERROR", message => toast.error(message));
    this.io.on("/api/unicorns", (method, id, data) => {
      if (this.state.isSingleFetch && method !== "DELETE")
        this.handleSingleFetch(parseInt(id))
      else if (isViewMode) 
        this.fetchList();
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

  handleSingleFetch = async (id) => {
    const cancelToken = this.AxiosUtils.getCancelToken();
    const result = await this.AxiosUtils.onGet(id, cancelToken);
    if (result)
    {
      const list = this.state.list.map(el =>
        el["unicorn_id"] === id ? { ...el, ...result.data.result } : el
      )
      this.setState({list})
    };
  }

  handleStateUpdate = (id, data) => {
    this.setState(state => {
      return {
        list: state.list.map(el =>
          el["unicorn_id"] === id ? { ...el, ...data } : el
        )
      };
    });
    toast(`🦄 ID:${id} Updated`);
  };

  handleStateCreate = (id, data) => {
    const newRow = { unicorn_id: id, ...data, creation_date: "NOW" };
    this.setState(state => {
      return { list: [...state.list, newRow] };
    });
    toast(`🦄 ID:${id} Created`);
  };

  handleStateDelete = id => {
    this.setState(state => {
      return {
        list: state.list.filter(data => data.unicorn_id !== id)
      };
    });
    toast(`🦄 ID:${id} Deleted`);
  };

  fetchList() {
    const cancelToken = this.AxiosUtils.getCancelToken();
    // sleep(1500).then(() =>
    this.AxiosUtils.onGetAll(null, cancelToken).then(result => {
      if (result.data.result) {
        this.setState({ list: result.data.result });
        toast(`🦄 Fetched`);
      }
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
