import { combineReducers } from "@reduxjs/toolkit";
import moviePageReducer from "./moviePage";

export default combineReducers({
  moviePage: moviePageReducer,
});
