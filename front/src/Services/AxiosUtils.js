import axios from "axios";
import socketIOClient from "socket.io-client";

const API_URL = "http://localhost:8080/api";
const AxiosConfig = {
  headers: { "Content-Type": "application/json; charset=utf-8" }
};
const SOCKET_API = socketIOClient("http://localhost:8080");

export const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const handleCatch = err => {
  if (axios.isCancel(err)) console.info("Request Canceled", err.message);
  else console.error("Request Failed", err.message);

  return { data: [] };
};

export default class AxiosUtils {
  constructor(setLoading, route) {
    this._api_url = `${API_URL}/${route}`;
    this.setLoading = setLoading;
    this.socket = SOCKET_API;
  }

  getCancelToken = () => {
    return axios.CancelToken.source();
  };

  onGetAll = async (params, cancelToken) => {
    this.setLoading(true);
    const response = await axios
      .get(this._api_url, {
        ...AxiosConfig,
        params,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        handleCatch(err);
      })
      .finally(() => sleep(1000).then(() => this.setLoading(false)));

    return response;
  };

  onGet = async (id, cancelToken) => {
    this.setLoading(true);
    const response = await axios
      .get(`${this._api_url}/${id}`, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        handleCatch(err);
      })
      .finally(() => sleep(1000).then(() => this.setLoading(false)));

    return response;
  };

  onCreate = async (props, cancelToken) => {
    this.setLoading(true);
    const response = await axios
      .post(this._api_url, props, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        handleCatch(err);
      })
      .finally(() => sleep(1000).then(() => this.setLoading(false)));

    return response;
  };

  onUpdate = async (id, props, cancelToken) => {
    this.setLoading(true);
    const response = await axios
      .patch(`${this._api_url}/${id}`, props, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        handleCatch(err);
      })
      .finally(() => sleep(1000).then(() => this.setLoading(false)));

    return response;
  };

  onDelete = async (id, cancelToken) => {
    this.setLoading(true);
    const response = await axios
      .delete(`${this._api_url}/${id}`, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        handleCatch(err);
      })
      .finally(() => sleep(1000).then(() => this.setLoading(false)));

    return response;
  };

  onReset = async cancelToken => {
    this.setLoading(true);
    const response = await axios
      .delete(`${this._api_url}`, {
        ...AxiosConfig,
        cancelToken: cancelToken.token
      })
      .catch(err => {
        handleCatch(err);
      })
      .finally(() => sleep(1000).then(() => this.setLoading(false)));

    return response;
  };
}
