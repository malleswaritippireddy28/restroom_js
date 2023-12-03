import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import ToggleMap from "../Components/toggle-map";
import { getRooms, mapToken } from "../utilities/utility";
import * as turf from "@turf/turf";
import { Link, useNavigate } from "react-router-dom";
import * as ReactDOMServer from "react-dom/server";
import Star from "@mui/icons-material/StarBorderPurple500";
import { CircularProgress, Grid, IconButton } from "@mui/material";
import { loader, myLatLngSignal } from "../App";

const Map = ({ isMobile }) => {
  mapboxgl.accessToken = mapToken();
  const mapContainer = useRef(null);
  const [zoom, setZoom] = useState(9);
  const map_ = useRef(null);
  useEffect(() => {
    if (!map_.current && myLatLngSignal.value.length === 0) return; // initialize map only once
    map_.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: myLatLngSignal.value,
      zoom: zoom,
    });
    loadMarkers();
    map_.current.addControl(new mapboxgl.NavigationControl(), "top-left");
    document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[0].remove();
  }, []);

  const RawMarkup = ({ roomDdetails, distance }) => {
    return (
      <div class="card">
        <img
          src={`${roomDdetails.imageURL}`}
          alt="Avatar"
          style={{ width: "100%" }}
        />
        <div class="container">
          <h4>
            <b>{roomDdetails.name}</b>
          </h4>
          <div>
            <b>Distance</b> {distance?.toFixed(2)}Miles
          </div>
          <div>
            <b>Rating</b> <b>{roomDdetails.rating}</b>
          </div>
          <p>
            {roomDdetails.description}
            &nbsp;
            <a href={`detail/${roomDdetails._id}`}>Show Details</a>
          </p>
        </div>
      </div>
    );
  };

  const loadMarkers = async () => {
    loader.value = true;
    const rooms = await getRooms(
      100,
      myLatLngSignal.value[0],
      myLatLngSignal.value[1]
    );
    const map = map_.current;

    const geojson = {
      type: "FeatureCollection",
      features: rooms.map((room) => ({
        type: "Feature",
        properties: {
          message: room.description,
          iconSize: [60, 60],
        },
        geometry: {
          type: "Point",
          coordinates: [room.lng, room.lat],
          roomDdetails: room,
        },
      })),
    };

    new mapboxgl.Marker()
      .setLngLat(myLatLngSignal.value)
      .setPopup(
        new mapboxgl.Popup({ offset: 35 })
          .setLngLat(myLatLngSignal.value)
          .setHTML(`<h1>You</h1>`)
      )
      .addTo(map_.current)
      .togglePopup();

    // Add markers to the map.
    for (const marker of geojson.features) {
      // Create a DOM element for each marker.
      const el = document.createElement("div");
      const width = marker.properties.iconSize[0];
      const height = marker.properties.iconSize[1];
      el.className = "marker";
      el.style.backgroundImage = `url(https://main--playful-taffy-7c5a83.netlify.app/marker.png)`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";
      el.style.backgroundRepeat = "no-repeat";

      el.addEventListener("click", () => {
        console.log(marker.geometry.coordinates, myLatLngSignal.value);
      });
      var from = turf.point(marker.geometry.coordinates);
      var to = turf.point(myLatLngSignal.value);
      var options = { units: "miles" };
      var distance = turf.distance(from, to, options);
      const roomDdetails = marker.geometry.roomDdetails;

      // Add markers to the map.
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 35 })
            .setLngLat(marker.geometry.coordinates)
            .setHTML(
              ReactDOMServer.renderToString(
                <RawMarkup roomDdetails={roomDdetails} distance={distance} />
              )
            )
        )
        .addTo(map)
        .togglePopup();
    }

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", "places", (e) => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      // popup.setLngLat(coordinates).setHTML(description).addTo(map);

      new mapboxgl.Popup({ offset: 35 })
        .setLngLat(coordinates)
        .setHTML(
          `<div class="card">
      <img src="" alt="Avatar" style="width:100%">
      <div class="container">
        <h4><b>Jane Doe</b></h4> 
        <p>Interior Designer</p> 
      </div>
    </div>`
        )
        .addTo(map);
    });

    map.on("mouseleave", "places", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
    loader.value = false;
  };

  return (
    <>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          {/* <MapBox /> */}
          <div
            ref={mapContainer}
            className="map-container"
            style={{ height: "90vh", width: "100%", position: "relative" }}
          />
        </Grid>
        {isMobile ? (
          <ToggleMap type={"map"} />
        ) : (
          <Grid item xs={2}>
            <ToggleMap type={"map"} />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Map;
