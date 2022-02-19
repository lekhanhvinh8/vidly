import axios from "axios";
import * as actions from "../api";

const api = (store) => (next) => async (action) => {
  if (action.type !== actions.apiCallBegan.type) return next(action);

  const { url, method, data, onStart, onSuccess, onFailure } = action.payload;

  onStart &&
    store.dispatch({
      type: onStart,
      payload: {},
    });

  next(action);

  try {
    // if (method) {
    //   await new Promise((resolve) => setTimeout(resolve, 2000));
    // }
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url,
      method,
      data,
    });

    store.dispatch(actions.apiCallSuccess(response.data));

    onSuccess &&
      store.dispatch({
        type: onSuccess,
        payload: response.data,
      });
  } catch (ex) {
    store.dispatch(actions.apiCallFailed(ex.message));
    onFailure &&
      store.dispatch({
        type: onFailure,
        payload: { message: ex.message },
      });
  }
};

export default api;
