import { combineReducers } from "@reduxjs/toolkit";
import moviesReducer from "./movies";
import genresReducer from "./genres";

export default combineReducers({
  movies: moviesReducer,
  genres: genresReducer,
});
