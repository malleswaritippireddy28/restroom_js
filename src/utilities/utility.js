import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://next-js-api-ten.vercel.app";
const TOKEN_KEY = "token";

export const getRooms = async () => {
  const data = await axios.get(`${API_URL}/api/rooms`);
  return data.data.data;
};

export const addRoom = async (roomModel) => {
  const data = await axios.post(`${API_URL}/api/rooms`, roomModel);
  return data.data;
};

export const login = async (loginModel) => {
  const data = await axios.post(`${API_URL}/api/users/login`, loginModel);
  return data.data;
};

export const signUp = async (regModel) => {
  const data = await axios.post(`${API_URL}/api/users/signup`, regModel);
  return data.data;
};

export const setToken = (token) => {
  if (typeof token === "string") localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    return jwtDecode(token);
  }
  return null;
};

export const logout = () => {
  localStorage.clear();
};

export const getLocation = (callback) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(callback);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

export const mapToken = () =>
  "pk.eyJ1IjoiZGV2a2hhZGFyIiwiYSI6ImNrMWpmaTZiaDBhazEzY3A3N25ubDdqbWsifQ.2FGZvQTQZKkMoQ9-kNbesw";
