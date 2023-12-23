import http from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiUrl;

export function register(user) {
  return http.post(apiEndpoint + "/register", {
    email: user.username,
    password: user.password,
    name: user.name,
    userType: user.userType,
  });
}
