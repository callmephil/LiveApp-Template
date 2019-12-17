import axios from "axios";
import socketIOClient from "socket.io-client";
import { setSleepState } from "../Utils/Delayer";

const { REACT_APP_API_URL, REACT_APP_SOCKET_URL } = process.env;
const API_URL = REACT_APP_API_URL;
const SOCKET_API = socketIOClient(REACT_APP_SOCKET_URL);
const AxiosConfig = {
  headers: { "Content-Type": "application/json; charset=utf-8" }
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
  constructor(setLoading, route, refTimeout) {
    this._api_url = `${API_URL}/${route}`;
    this.setLoading = setLoading;
    this.socket = SOCKET_API;
    this.refTimeout = refTimeout;
  }

  getCancelToken = () => {
    return axios.CancelToken.source();
  };

  onGetAll = (params, cancelToken) => {
    return setSleepState(this.refTimeout, this.setLoading, 1000).then(
      async () => {
        try {
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
      }
    );
  };

  onGet = async (id, cancelToken) => {
    return setSleepState(this.refTimeout, this.setLoading, 500).then(
      async () => {
        try {
          const response = await axios.get(`${this._api_url}/${id}`, {
            ...AxiosConfig,
            cancelToken: cancelToken.token
          });

          if (response && response.data.result) {
            return {
              success: true,
              isCancel: false,
              isLoading: false,
              result: response.data.result
            };
          } else
            return {
              success: false,
              isCancel: false,
              result: null
            };
        } catch (err) {
          return handleCatch(err);
        }
      }
    );
  };

  onCreate = (props, cancelToken) => {
    return setSleepState(this.refTimeout, this.setLoading).then(async () => {
      const response = await axios
        .post(this._api_url, props, {
          ...AxiosConfig,
          cancelToken: cancelToken.token
        })
        .catch(err => {
          return handleCatch(err);
        });

      return response;
    });
  };

  onUpdate = async (id, props, cancelToken) => {
    return setSleepState(this.refTimeout, this.setLoading).then(async () => {
      const response = await axios
        .patch(`${this._api_url}/${id}`, props, {
          ...AxiosConfig,
          cancelToken: cancelToken.token
        })
        .catch(err => {
          return handleCatch(err);
        });

      return response;
    });
  };

  onDelete = async (id, cancelToken) => {
    return setSleepState(this.refTimeout, this.setLoading).then(async () => {
      const response = await axios
        .delete(`${this._api_url}/${id}`, {
          ...AxiosConfig,
          cancelToken: cancelToken.token
        })
        .catch(err => {
          return handleCatch(err);
        });

      return response;
    });
  };

  // Temporary for testing purposes
  onReset = cancelToken => {
    return setSleepState(this.refTimeout, this.setLoading).then(async () => {
      const response = await axios.delete(`${this._api_url}`, {
          ...AxiosConfig,
          cancelToken: cancelToken.token
        })
        .catch(err => {
          return handleCatch(err);
        });

      return response;
    });
  };
}
