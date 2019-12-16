import React, { PureComponent } from "react";
import { toast } from "react-toastify";
import AxiosUtils, { sleep } from "./AxiosUtils";
import { arrayOfObjectsManager } from "../Utils/StateManager";
import PropTypes from "prop-types";

export const MyContext = React.createContext(null);

class Context extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      editData: null,
      isLoading: false,
      isEditMode: false,
      isSingleFetch: true
    };

    // const setLoading = isLoading => this.setState({ isLoading });
    this.AxiosUtils = new AxiosUtils(this.setLoading, this.props.route);
    this.cancelToken = this.AxiosUtils.getCancelToken();
    this.io = this.AxiosUtils.socket;
    this.manager = React.createRef(null);
  }
  static defaultProps = {
    isViewMode: false
  };
  static propTypes = {
    isViewMode: PropTypes.bool,
    route: PropTypes.string.isRequired,
    primaryID: PropTypes.string.isRequired,
    toastIcon: PropTypes.string.isRequired
  };

  setLoading = isLoading => this.setState({ isLoading });

  componentDidMount() {
    this.fetchList();
    this.handleSocket(this.props.isViewMode);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.list.length > 0)
      if (prevState.list !== this.state.list)
        this.manager.current = arrayOfObjectsManager(
          this,
          this.state.list,
          "list",
          this.props.primaryID
        );
  }

  componentWillUnmount() {
    this.cancelToken.cancel("unmounting");
    this.io.off(`/api/${this.props.route}`);
    this.io.off("ERROR");
  }

  handleSocket(isViewMode) {
    this.io.on("ERROR", message => toast.error(message));
    this.io.on(`/api/${this.props.route}`, (method, id, data) => {
      if (this.state.isSingleFetch && method !== "DELETE")
        this.fetchByID(parseInt(id));
      else if (isViewMode) this.fetchList();
      else {
        sleep(1000)
          .then(() => {
            switch (method) {
              case "DELETE":
                this.manager.current.handleStateDelete(parseInt(id));
                break;
              case "POST":
                this.manager.current.handleStateCreate(
                  parseInt(id),
                  JSON.parse(data),
                  { creation_date: "NOW" }
                );
                break;
              case "PATCH":
                this.manager.current.handleStateUpdate(
                  parseInt(id),
                  JSON.parse(data)
                );
                break;
              default:
                console.error(`unknown method ${method}`);
            }
          })
          .finally(() => {
            this.setLoading(false);
            toast(`${method} ${this.props.toastIcon} ID:${id}`);
          });
      }
    });
  }

  _GetByID = id => {
    const result = this.state.list.find(
      data => data[this.props.primaryID] === id
    );
    if (result) this.setState({ isEditMode: true, editData: result });
  };

  _ClearEditMode = () => {
    this.setState({ isEditMode: false, editData: null });
  };

  fetchList = async () => {
    const response = await this.AxiosUtils.onGetAll(null, this.cancelToken);
    if (response.success) {
      if (response.result && !response.isCancel) {
        this.setState({ list: response.result, isLoading: false });
        toast(`${this.props.toastIcon} List Loaded`);
      }
    } else toast.error(`${this.props.toastIcon} ${response.result}`);
  };

  fetchByID = async id => {
    const response = await this.AxiosUtils.onGet(id, this.cancelToken);
    if (response.success) {
      if (response.result && !response.isCancel) {
        this.manager.current.handleStateUpdate(id, response.result);
        toast(`${this.props.toastIcon} fetchByID: ${id}`);
      } else toast.error(`${this.props.toastIcon} ${response.result}`);
    }
  };

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
      <MyContext.Provider
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
      </MyContext.Provider>
    );
  }
}

export default Context;
