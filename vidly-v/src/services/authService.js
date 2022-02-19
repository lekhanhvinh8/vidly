import httpService from "./httpService";
import jwtDecode from "jwt-decode";
import { apiUrl } from "../config.json";
import http from "./httpService";

const apiEndpoint = apiUrl + "auth";
const jwtKeyName = "jwt";

http.setJwtHeader(getJwt());

export async function login(email, password) {
  const { data: jwt } = await httpService.post(apiEndpoint, {
    email,
    password,
  });

  localStorage.setItem(jwtKeyName, jwt);

  return jwt;
}

export function loginWithJwt(jwt) {
  localStorage.setItem(jwtKeyName, jwt);
}

export function logout() {
  localStorage.removeItem(jwtKeyName);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(jwtKeyName);
    const user = jwtDecode(jwt);
    return user;
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  const jwt = localStorage.getItem(jwtKeyName);
  return jwt;
}

const auth = {
  login,
  logout,
  getCurrentUser,
  loginWithJwt,
  getJwt,
};

export default auth;
