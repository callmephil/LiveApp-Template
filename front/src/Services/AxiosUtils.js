import axios from "axios";
import socketIOClient from "socket.io-client";

const API_URL =
"http://localhost:8080/api/users";
const AxiosConfig = {
    headers: { "Content-Type": "application/json; charset=utf-8" }
};
const SOCKET_API = socketIOClient("http://localhost:8080");

export default class AxiosUtils {
  constructor(setIsLoading) {
    this._route = "";
    this.setIsLoading = setIsLoading;
    this.socket = SOCKET_API;
  }

  getSocketIOClient = () => {
    return this.socket;
  }

  getCancelToken = () => {
    return axios.CancelToken.source();
  };

  onGetAll = (props, cancelToken) => {
    this.setIsLoading(true);
    return axios
      .get(API_URL, {
        ...AxiosConfig,
        params: { props },
        cancelToken: cancelToken.token
      })
      .catch(err => {
        if (axios.isCancel(err))
          console.log("onGetAll Request Canceled", err.message);
        else console.log("onGetAll Request Failed", err.message);

        return { data: [] };
      })
      .finally(this.setIsLoading(false));
  };

  onGet = (id, cancelToken) => {
    // Find a way to have it dynamically
    this.setIsLoading(true);
    return axios
      .get(`${API_URL}/${id}`, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        if (axios.isCancel(err))
          console.log("onGet Request Canceled", err.message);
        else console.log("onGet Request Failed", err.message);

        return { data: [] };
      })
      .finally(this.setIsLoading(false));
  };

  onCreate = (props, cancelToken) => {
    this.setIsLoading(true);
    return axios
      .post(API_URL, props, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        if (axios.isCancel(err))
          console.log("onCreate Request Canceled", err.message);
        else console.log("onCreate Request Failed", err.message);

        return { data: [] };
      })
      .finally(this.setIsLoading(false));
  };

  onUpdate = (id, props, cancelToken) => {
    this.setIsLoading(true);
    return axios
      .patch(`${API_URL}/${id}`, props, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        if (axios.isCancel(err))
          console.log("onUpdate Request Canceled", err.message);
        else console.log("onUpdate Request Failed", err.message);

        return { data: [] };
      })
      .finally(this.setIsLoading(false));
  };

  onDelete = (id, cancelToken) => {
    this.setIsLoading(true);
    return axios
      .delete(`${API_URL}/${id}`, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        if (axios.isCancel(err))
          console.log("onDelete Request Canceled", err.message);
        else console.log("onDelete Request Failed", err.message);

        return { data: [] };
      })
      .finally(this.setIsLoading(false));
  };
}
