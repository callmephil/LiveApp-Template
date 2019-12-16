import React, { PureComponent } from "react";
import { toast } from "react-toastify";
import AxiosUtils, { sleep } from "./AxiosUtils";

export const MyUnicornsContext = React.createContext(null);

class UnicornsContext extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      editData: null,
      isLoading: false,
      isEditMode: false,
      isSingleFetch: false
    };

    // const setLoading = isLoading => this.setState({ isLoading });
    this.AxiosUtils = new AxiosUtils(this.setLoading, "unicorns");
    this.cancelToken = this.AxiosUtils.getCancelToken();
    this.io = this.AxiosUtils.socket;
  }

  setLoading = isLoading => this.setState({ isLoading });

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
        this.fetchByID(parseInt(id));
      else if (isViewMode) this.fetchList();
      else {
        sleep(1000).then(() => {
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
        })
        .finally(() => toast(`${method} 👤 ID:${id}`))
      }
    });
  }

  handleStateUpdate = (id, data) => {
    this.setState(state => {
      return {
        list: state.list.map(el =>
          el["unicorn_id"] === id ? { ...el, ...data } : el
        )
      };
    });
  };

  handleStateCreate = (id, data) => {
    const newRow = { unicorn_id: id, ...data, creation_date: "NOW" };
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

  _GetByID = unicorn_id => {
    const result = this.state.list.find(
      data => data.unicorn_id === unicorn_id
    );
    if (result) this.setState({ isEditMode: true, editData: result });
  };

  _ClearEditMode = () => {
    this.setState({ isEditMode: false, editData: null });
  };

  fetchList = async () => {
    const response = await this.AxiosUtils.onGetAll(null, this.cancelToken);
    if (response) {
      this.setState({ list: response.data.result });
      toast(`👤 List Loaded`);
    }
  };

  fetchByID = id => {
    this.AxiosUtils.onGet(id, this.cancelToken).then((response) => {
     if (response) {
       return this.state.list.map(el =>
         el["unicorn_id"] === id ? { ...el, ...response.data.result } : el
       );
     }
   }).then(list => {
     console.log(list);
   this.setState({ list })
   toast(`👤 fetchByID: ${id}`);
  })
   
  }

  _UpdateByID = (unicorn_id, data) => {
    this.AxiosUtils.onUpdate(unicorn_id, data, this.cancelToken);
  };

  _DeleteByID = unicorn_id => {
    this.AxiosUtils.onDelete(unicorn_id, this.cancelToken);
  };

  _Create = data => {
    this.AxiosUtils.onCreate(data, this.cancelToken);
  };

  _Reset = () => {
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
