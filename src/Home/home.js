import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import RestRoom from "../Components/restroom";
import ToggleMap from "../Components/toggle-map";
import {
  findTransaction,
  getLocation,
  getRoomTransactions,
  getRooms,
  roomtransactions,
  updateRoom,
} from "../utilities/utility";
import { loader, myLatLngSignal, toggleSnackBar } from "../App";
import { computed } from "@preact/signals-react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Home = ({ isMobile, ...props }) => {
  const [roomsData, setRoomsData] = useState([]);
  useEffect(() => {
    getRoomsData();
  }, []);

  const onDeleteRoom = async (id) => {
    loader.value = true;
    await updateRoom({ id, rating: 0, actionType: "DELETE" });
    setRoomsData(roomsData.filter((x) => x._id !== id));
    loader.value = false;
    toggleSnackBar.value = {
      isOpen: true,
      message: "Room deleted successfully",
    };
  };

  useEffect(() => {
    if (roomtransactions.value.length === 0)
      (async () => await getRoomTransactions())();
  }, [roomsData]);
  const getRoomsData = async () => {
    loader.value = true;
    getLocation(async (loc) => {
      const data = await getRooms(
        100,
        loc.coords.longitude,
        loc.coords.latitude
      );
      setRoomsData(data);
    });
  };

  return (
    <>
      {roomsData &&
        roomsData.map((room) => {
          return (
            <RestRoom
              key={room._id}
              room={room}
              isMobile={isMobile}
              transaction={findTransaction(room._id)}
              onDeleteRoom={() => onDeleteRoom(room._id)}
            />
          );
        })}
      <ToggleMap />
    </>
  );
};

export default Home;
