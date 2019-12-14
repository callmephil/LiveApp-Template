import axios from "axios";
import socketIOClient from "socket.io-client";

const API_URL = "http://localhost:8080/api";
const AxiosConfig = {
  headers: { "Content-Type": "application/json; charset=utf-8" }
};
const SOCKET_API = socketIOClient("http://localhost:8080");

export default class AxiosUtils {
  constructor(setIsLoading, route) {
    this._api_url = `${API_URL}/${route}`;
    this.setIsLoading = setIsLoading;
    this.socket = SOCKET_API;
  }
  
  getCancelToken = () => {
    return axios.CancelToken.source();
  };

  onGetAll = (props, cancelToken) => {
    this.setIsLoading(true);
    return axios
      .get(this._api_url, {
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
      .get(`${this._api_url}/${id}`, {
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
      .post(this._api_url, props, {
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
      .patch(`${this._api_url}/${id}`, props, {
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
      .delete(`${this._api_url}/${id}`, {
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

  onReset = cancelToken => {
    this.setIsLoading(true);
    return axios
      .delete(`${this._api_url}`, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        if (axios.isCancel(err))
          console.log("onDelete Request Canceled", err.message);
        else console.log("onDelete Request Failed", err.message);
        return { success: false };
      })
      .finally(this.setIsLoading(false));
  };
}
