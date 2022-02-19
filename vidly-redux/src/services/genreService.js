import httpService from "./httpService";
import { apiUrl } from "../config.json";

export async function getGenres() {
  const { data: genres } = await httpService.get(apiUrl + "genres");

  return genres;
}

export async function getGenre(id) {
  const { data: genre } = await httpService.get(apiUrl + "genres/" + id);

  return genre;
}
