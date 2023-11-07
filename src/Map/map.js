import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import ToggleMap from "../Components/toggle-map";
import { getLocation, getRooms, mapToken } from "../utilities/utility";
import * as turf from "@turf/turf";
import { Link, useNavigate } from "react-router-dom";
import * as ReactDOMServer from "react-dom/server";


const Map = () => {
  mapboxgl.accessToken = mapToken();
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const [latLng, setLatLng] = useState([]);
  const [zoom, setZoom] = useState(9);
  const map_ = useRef(null);
  useEffect(() => {
    getLocation((loc) => {
      if (latLng.length === 0)
        setLatLng([loc.coords.longitude, loc.coords.latitude]);
      console.log("MY Position", loc);
    });
    console.log("latLng", latLng);
    if (!map_.current && latLng.length === 0) return; // initialize map only once
    map_.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: latLng,
      zoom: zoom,
    });
    loadMarkers();
    map_.current.addControl(new mapboxgl.NavigationControl(), "top-left");
    document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[0].remove();
  }, [latLng]);

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
    const rooms = await getRooms();
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
      .setLngLat(latLng)
      .setPopup(
        new mapboxgl.Popup({ offset: 35 })
          .setLngLat(latLng)
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
        console.log(marker.geometry.coordinates, latLng);
      });
      var from = turf.point(marker.geometry.coordinates);
      var to = turf.point(latLng);
      var options = { units: "miles" };
      var distance = turf.distance(from, to, options);
      const roomDdetails = marker.geometry.roomDdetails;
    
      // Add markers to the map.
      const marker = new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates);

      // Create a popup and set its content using ReactDOMServer.renderToString
      const popupContent = ReactDOMServer.renderToString(
        <RawMarkup roomDdetails={roomDdetails} distance={distance} />
      );

      const popup = new mapboxgl.Popup({ offset: 35 })
        .setLngLat(marker.geometry.coordinates)
        .setHTML(popupContent);

      // Set the popup for the marker
      marker.setPopup(popup);

// Add the marker to the map and toggle the popup
      marker.addTo(map).togglePopup();
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
  };
  return (
    <div>
      <ToggleMap type={"map"} />
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: "90vh", width: "100%", position: "relative" }}
      />
    </div>
  );
};

export default Map;
