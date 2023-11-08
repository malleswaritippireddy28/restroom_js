import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import RestRoom from "../Components/restroom";
import ToggleMap from "../Components/toggle-map";
import { getRooms } from "../utilities/utility";
import { CircularProgress, useMediaQuery, useTheme } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Home = () => {
  const [roomsData, setRoomsData] = useState([]);
  useEffect(() => {
    getRoomsData();
  }, []);
  const getRoomsData = async () => {
    const data = await getRooms();
    setRoomsData(data);
  };
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <>
      <div className="loader">
      </div>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          {roomsData &&
            roomsData.map((room) => (
              <RestRoom room={room} isMobile={matches} />
            ))}
        </Grid>
        <Grid item xs={2}>
          <ToggleMap />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
