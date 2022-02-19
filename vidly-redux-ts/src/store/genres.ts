import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getGenres } from "../services/genreService";
import { Genre } from "../models/movies";
import { AppThunk } from "./store";

const initialGenres: Array<Genre> = [{ _id: "", name: "All Genres" } as Genre];

const slice = createSlice({
  name: "genres",
  initialState: initialGenres,
  reducers: {
    genresLoaded: (genres, action: PayloadAction<Array<Genre>>) => {
      return action.payload;
    },
  },
});

export default slice.reducer;
const { genresLoaded } = slice.actions;

//Action Creator
export const loadGenres = (): AppThunk => async (dispatch, getState) => {
  const genres = await getGenres();
  const newGenres = [{ _id: "", name: "All Genres" }, ...genres];
  dispatch(genresLoaded(newGenres));
};
