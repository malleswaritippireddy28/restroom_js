import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { addRoom, mapToken } from "../../utilities/utility";
import { loader, mapSignal, myLatLngSignal, toggleSnackBar } from "../../App";
import { addRoomImage, addRoomTransaction } from "../../firebase";
import MapBox from "../../Components/mapbox";

const AddRoom = ({ isMobile }) => {
  const [mLatLng, setMLatLng] = useState({ lat: 0, lng: 0 });
  const [marker, setMarker] = useState(null);
  const [fileData, setFileData] = useState(null);
  const handleSubmit = async (event) => {
    loader.value = true;
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var bodyFormData = new FormData();
    // bodyFormData.append("file", fileData);
    bodyFormData.append("imageURL", await addRoomImage(fileData));
    bodyFormData.append("location", data.get("email"));
    bodyFormData.append("password", data.get("password"));
    bodyFormData.append("name", data.get("firstName"));
    bodyFormData.append("description", data.get("lastName"));
    bodyFormData.append("lat", mLatLng.lat);
    bodyFormData.append("lng", mLatLng.lng);
    const response = await addRoom(bodyFormData);

    if (response?.msg === "success") {
      toggleSnackBar.value = {
        isOpen: true,
        message: "Room added successfully",
      };
      const { _id, name } = response.token;
      await addRoomTransaction({ id: _id, name });
    } else {
      toggleSnackBar.value = {
        isOpen: true,
        message: "Something went wrong, Please try after sometime",
      };
    }
    loader.value = false;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!isMobile && (
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
        )}
        <Typography component="h1" variant="h5">
          Room
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <MapBox
                style={{
                  height: "300px",
                  width: "100%",
                  position: "relative",
                }}
                addUserMarker
                moveMarkerToCenter
                onMapClickAddMarker={(selectedLatLng, marker) => {
                  setMLatLng(selectedLatLng);
                  setMarker(marker);
                }}
                removeMarker
                // markers={marker ? [marker] : []}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Rooom Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Description"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Friendly Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                disabled
                fullWidth
                name="password"
                label="Lattitude"
                id="password"
                value={mLatLng.lat}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                disabled
                fullWidth
                name="password"
                label="Longitude"
                value={mLatLng.lng}
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              {/* <Button variant="contained" component="label"> */}
              <TextField
                required
                fullWidth
                onChange={(e) => setFileData(e.target.files[0])}
                type="file"
                name="password"
                id="fileData"
                autoComplete="new-password"
              />
              {/* </Button> */}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Room
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AddRoom;
