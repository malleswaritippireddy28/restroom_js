import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import { addRoom, getLocation, mapToken } from "../../utilities/utility";
import mapboxgl from "mapbox-gl";

const AddRoom = () => {
  mapboxgl.accessToken = mapToken();
  const [mLatLng, setMLatLng] = useState({ lat: 0, lng: 0 });

  const mapContainer = useRef(null);
  const [latLng, setLatLng] = useState([]);

  // Add Refactored code of type "Rename field"
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await addRoom({
        email: data.get("email"), // Renamed field from 'location' to 'email'
        password: data.get("password"),
        firstName: data.get("firstName"), // Updated field names accordingly
        lastName: data.get("lastName"), // Updated field names accordingly
        lat: mLatLng.lat,
        lng: mLatLng.lng,
        imageURL: "",
    });
    if (response.msg) alert("Saved");
    else alert(response.msg);
};

  const map_ = useRef(null);
  var marker = null;
  useEffect(() => {
    getLocation((loc) => {
      if (latLng.length === 0)
        setLatLng([loc.coords.longitude, loc.coords.latitude]);
    });
    console.log("latLng", latLng);
    if (!map_.current && latLng.length === 0) return; // initialize map only once
    map_.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: latLng,
      zoom: zoom,
    });
    document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[0].remove();
    const map = map_.current;
    map.on("click", function add_marker(event) {
      var coordinates = event.lngLat;
      console.log("Lng:", coordinates.lng, "Lat:", coordinates.lat);
      if (marker) marker.remove();

      //   marker = new mapboxgl.Marker({ draggable: false, color: "blue" })
      //     .setLngLat(coordinates)
      //     .addTo(map);
      map.flyTo({
        zoom: 15,
        speed: 5,
      });

      setMLatLng({ lat: coordinates.lat, lng: coordinates.lng });
      //   marker.setLngLat(coordinates).addTo(map);

      const el = document.createElement("div");
      const width = 60;
      const height = 60;
      el.className = "marker";
      el.style.backgroundImage = `url(https://main--playful-taffy-7c5a83.netlify.app/marker.png)`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";
      el.style.backgroundRepeat = "no-repeat";

      // Add markers to the map.
      marker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map);

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      //   var popup = new mapboxgl.Popup({ offset: 35 })
      //     .setLngLat(coordinates)
      //     .setHTML("MapBox Coordinate<br/>" + coordinates)
      //     .addTo(map);
    });
  }, [latLng]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <h1> Add Room</h1>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Room
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <div
                    ref={mapContainer}
                    className="map-container"
                    style={{
                      height: "300px",
                      width: "100%",
                      position: "relative",
                    }}
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
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </>
  );
};

export default AddRoom;
