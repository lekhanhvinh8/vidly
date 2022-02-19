import { combineReducers } from "@reduxjs/toolkit";
import entitiesReducer from "./entities";
import uiReducer from "./ui";

export default combineReducers({
  entities: entitiesReducer,
  ui: uiReducer,
});
