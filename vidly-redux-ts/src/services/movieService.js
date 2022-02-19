import httpService from "./httpService";
import { apiUrl } from "../config.json";

export async function getMovies() {
  const { data: movies } = await httpService.get(apiUrl + "movies");

  return movies;
}

export async function getMovie(id) {
  const { data: movie } = await httpService.get(apiUrl + "movies/" + id);

  return movie;
}

export async function saveMovie(movie) {
  let newMovie;

  const body = { ...movie };
  delete body._id;

  if (!movie._id) {
    const result = await httpService.post(apiUrl + "movies", body);
    newMovie = result.data;
  } else {
    const result = await httpService.put(apiUrl + "movies/" + movie._id, body);
    newMovie = result.data;
  }

  return newMovie;
}

export async function deleteMovie(movieId) {
  return await httpService.delete(apiUrl + "movies/" + movieId);
}
