import { createSlice } from "@reduxjs/toolkit";
import { getGenres } from "../services/genreService";

const slice = createSlice({
  name: "genres",
  initialState: [{ _id: "", name: "All Genres" }],
  reducers: {
    genresLoaded: (genres, action) => {
      return action.payload;
    },
  },
});

export default slice.reducer;
const { genresLoaded } = slice.actions;

//Action Creator
export const loadGenres = () => async (dispatch, getState) => {
  const genres = await getGenres();
  dispatch(genresLoaded([{ _id: "", name: "All Genres" }, ...genres]));
};
