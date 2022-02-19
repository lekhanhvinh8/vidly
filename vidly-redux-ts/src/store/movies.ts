import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Movie } from "../models/movies";
import {
  getMovies,
  deleteMovie as deleteMovieService,
} from "../services/movieService";
import { AppDispatch, AppThunk } from "./store";

const slice = createSlice({
  name: "movies",
  initialState: [] as Array<Movie>,
  reducers: {
    moviesLoaded: (movies, action: PayloadAction<Array<Movie>>) => {
      return action.payload;
    },
    movieAdded: (movies, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      movies.push(movie);
    },
    movieLiked: (movies, action: PayloadAction<string>) => {
      const index = getMovieIndex(movies, action.payload);
      movies[index].liked = !movies[index].liked;
    },
    movieDeleted: (movies, action: PayloadAction<string>) => {
      const index = movies.findIndex((m) => m._id === action.payload);
      movies[index].isDeleted = true;
    },
    movieUndoDeleted: (movies, action: PayloadAction<string>) => {
      const index = movies.findIndex((m) => m._id === action.payload);
      movies[index].isDeleted = false;
    },
    deletedMoviesCleaned: (movies) => {
      return movies.filter((m) => !m.isDeleted);
    },
  },
});

function getMovieIndex(movies: Array<Movie>, movieId: string) {
  return movies.findIndex((m) => m._id === movieId);
}

const {
  moviesLoaded,
  movieLiked,
  movieDeleted,
  movieUndoDeleted,
  deletedMoviesCleaned,
  movieAdded,
} = slice.actions;

//Action Creator
export const loadMovies = (): AppThunk => async (dispatch, getState) => {
  const movies: Movie[] = await getMovies();
  dispatch(moviesLoaded(movies));
};

export const deleteMovie =
  (movieId: string): AppThunk =>
  async (dispatch, getState) => {
    dispatch(movieDeleted(movieId));

    try {
      await deleteMovieService(movieId);
    } catch (ex: any) {
      if (ex.response) {
        if (ex.response.status === 404)
          toast.error("This movie has alreadly been deleted");

        if (ex.response.status === 400) toast.error("You are not logged in");

        if (ex.response.status === 403) toast.error("You have no permission");
      }

      dispatch(movieUndoDeleted(movieId));
    }
  };

export const likeMovie = (movieId: string) => (dispatch: AppDispatch) => {
  dispatch(movieLiked(movieId));
};

export const cleanDeletedMovies = () => (dispatch: AppDispatch) => {
  dispatch(deletedMoviesCleaned());
};

export const addMovie = (movie: Movie) => {
  return movieAdded(movie);
};

export default slice.reducer;
