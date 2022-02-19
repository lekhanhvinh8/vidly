import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getMovies,
  deleteMovie as deleteMovieService,
} from "../services/movieService";

const slice = createSlice({
  name: "movies",
  initialState: [],
  reducers: {
    moviesLoaded: (movies, action) => {
      return action.payload;
    },
    movieAdded: (movies, action) => {
      const movie = action.payload;
      movies.push(movie);
    },
    movieLiked: (movies, action) => {
      const index = getMovieIndex(movies, action.payload);
      movies[index].liked = !movies[index].liked;
    },
    movieDeleted: (movies, action) => {
      const index = movies.findIndex((m) => m._id === action.payload);
      movies[index].isDeleted = true;
    },
    movieUndoDeleted: (movies, action) => {
      const index = movies.findIndex((m) => m._id === action.payload);
      movies[index].isDeleted = false;
    },
    deletedMoviesCleaned: (movies, action) => {
      return movies.filter((m) => !m.isDeleted);
    },
  },
});

function getMovieIndex(movies, movieId) {
  return movies.findIndex((m) => m._id === movieId);
}

export default slice.reducer;

const {
  moviesLoaded,
  movieLiked,
  movieDeleted,
  movieUndoDeleted,
  deletedMoviesCleaned,
  movieAdded,
} = slice.actions;

//Action Creator
export const loadMovies = () => async (dispatch, getState) => {
  const movies = await getMovies();
  dispatch(moviesLoaded(movies));
};

export const deleteMovie = (movieId) => async (dispatch, getState) => {
  dispatch(movieDeleted(movieId));

  try {
    await deleteMovieService(movieId);
  } catch (ex) {
    if (ex.response) {
      if (ex.response.status === 404)
        toast.error("This movie has alreadly been deleted");

      if (ex.response.status === 400) toast.error("You are not logged in");

      if (ex.response.status === 403) toast.error("You have no permission");
    }

    dispatch(movieUndoDeleted(movieId));
  }
};

export const likeMovie = (movieId) => (dispatch) => {
  dispatch(movieLiked(movieId));
};

export const cleanDeletedMovies = () => (dispatch) => {
  dispatch(deletedMoviesCleaned());
};

export const addMovie = (movie) => {
  return movieAdded(movie);
};
