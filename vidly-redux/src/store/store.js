import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import api from "./middleware/api";

let store = null;

const configureAppStore = () => {
  store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(logger).concat(api),
  });

  return store;
};

export const getStore = () => store;

export default configureAppStore;
