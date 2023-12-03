import { signal } from "@preact/signals-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loader, toggleSnackBar } from "../App";

export const API_URL = "https://next-js-api-ten.vercel.app"; //"http://localhost:3001";
const TOKEN_KEY = "token";

export const configSignal = signal(100);
export const roomtransactions = signal([]);
export const getRooms = async (distance, lat, lng) => {
  loader.value = true;
  let URL = `${API_URL}/api/rooms`;
  if (distance && lat && lng) {
    URL = `${API_URL}/api/rooms?distance=${distance}&lat=${lat}&lng=${lng}`;
  }
  const data = await axios.get(URL);
  loader.value = false;
  return data.data.data;
};

export const getRoomDetail = async (id) => {
  loader.value = true;
  const data = await axios.get(`${API_URL}/api/rooms?id=${id}`);
  loader.value = false;
  return data.data.data;
};

export const getConfig = async (type) => {
  loader.value = true;
  const config = await axios.get(
    `${API_URL}/api/configuration?name=${type.toUpperCase()}`
  );
  configSignal.value = config.data.data.value;
  loader.value = false;
};

export const saveConfig = async () => {
  loader.value = true;
  const config = await axios.post(`${API_URL}/api/configuration`, {
    name: "DISTANCE",
    value: configSignal.value,
  });
  loader.value = false;
};

export const addRoom = async (roomModel) => {
  const data = await axios.post(`${API_URL}/api/rooms`, roomModel);
  return data.data;
};

export const addRoomTransactionToDB = async (trans) => {
  loader.value = true;
  const data = await axios.post(`${API_URL}/api/roomtransaction`, trans);
  loader.value = false;
  return data.data;
};

export const getRoomTransactions = async () => {
  loader.value = true;
  const trans = await axios.get(`${API_URL}/api/roomtransaction`);
  roomtransactions.value = trans.data.data;
  // console.log("Start----------")
  // roomtransactions.value.map((x) =>
  //   console.log(`Start ${new Date(x.start).toLocaleTimeString()} End ${new Date(x.end).toLocaleTimeString()}`)
  // );
  loader.value = false;
};

export const recordingData = signal({});

export const getRecordings = async () => {
  loader.value = true;
  const recordings = await axios.get(`${API_URL}/api/recordings`);
  const jsonData = [];
  // console.log("recordings", recordings.data.data);
  recordings.data.data.forEach((x) => {
    JSON.parse(JSON.parse(x.jsonData)).recordingJson.forEach((y) =>
      jsonData.push(y)
    );
  });
  recordingData.value = jsonData;
  loader.value = false;
};

export const login = async (loginModel) => {
  const data = await axios.post(`${API_URL}/api/users/login`, loginModel);
  return data.data;
};

export const signUp = async (regModel) => {
  const data = await axios.post(`${API_URL}/api/users/signup`, regModel);
  return data.data;
};

export const updateRoom = async (ratingObj) => {
  await axios.put(`${API_URL}/api/rooms`, ratingObj);
};

export const setToken = (token) => {
  if (typeof token === "string") localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    let t = jwtDecode(token);
    localStorage.setItem("userId", t.id);
    return t;
  }
  return null;
};

export const logout = () => {
  localStorage.clear();
};

export const getLocation = (callback) => {
  if (navigator.geolocation) {
    try {
      navigator.geolocation.getCurrentPosition(
        (loc) => {
          callback(loc);
        },
        (err) => {
          toggleSnackBar.value = {
            message: "Please allow location to display near by restrooms",
            isOpen: true,
            isError: true,
          };
          loader.value = true;
        }
      );
    } catch (e) {
      console.log("Errr", e);
    }
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

export const mapToken = () =>
  "pk.eyJ1IjoiZGV2a2hhZGFyIiwiYSI6ImNrMWpmaTZiaDBhazEzY3A3N25ubDdqbWsifQ.2FGZvQTQZKkMoQ9-kNbesw";

export const userSignal = signal({
  user: localStorage.getItem(TOKEN_KEY),
});

export const findTransaction = (id) => {
  return roomtransactions.value.find((x) => {
    const now = Date.now();
    if (id == x.roomid && now >= x.start && now <= x.end) return x.end;
  });
};
