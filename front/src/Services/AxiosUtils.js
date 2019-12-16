import axios from "axios";
import socketIOClient from "socket.io-client";

const API_URL = "http://localhost:8080/api";
const AxiosConfig = {
  headers: { "Content-Type": "application/json; charset=utf-8" }
};
const SOCKET_API = socketIOClient("http://localhost:8080");

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const handleCatch = err => {
  if (axios.isCancel(err)) {
    console.info("Request Canceled", err.message);
    return {
      success: true,
      isCancel: true,
      isLoading: false,
      result: null
    };
  } else {
    console.error("Axios Catch", err.message);
    return {
      success: false,
      isCancel: false,
      isLoading: false,
      result: err.message
    };
  }
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
    try {
      this.setLoading(true);
      const response = await axios.get(this._api_url, {
        ...AxiosConfig,
        params,
        cancelToken: cancelToken.token
      });

      if (response && response.data.result) {
        return {
          success: true,
          isCancel: false,
          isLoading: false,
          result: response.data.result
        };
      }
    } catch (err) {
      return handleCatch(err);
    }
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
      });

    if (response && response.data.result)
      return {
        success: true,
        isCancel: false,
        result: response.data.result
      };
    else
      return {
        success: false,
        isCancel: false,
        result: null
      };
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
      });

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
      });

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
      });

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
      });

    return response;
  };
}
