import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef } from "react";
import { loader, mapSignal, myLatLngSignal } from "../App";
import { getLocation, mapToken } from "../utilities/utility";

const MapBox = ({
  addUserMarker = false,
  moveMarkerToCenter,
  onMapClick,
  onMapClickAddMarker = false,
  removeMarker = false,
  markers = [],
  ...props
}) => {
  const mapContainer = useRef(null);
  mapboxgl.accessToken = mapToken();
  useEffect(() => {
    loader.value = true;
    getLocation((loc) => {
      myLatLngSignal.value = [loc.coords.longitude, loc.coords.latitude];
      if (!mapContainer.current) return;
      mapSignal.value = new mapboxgl.Map({
        container: mapContainer.current || "",
        style: "mapbox://styles/mapbox/streets-v12",
        center: myLatLngSignal.value,
        zoom: 9,
      });
      loader.value = false;
      mapSignal.value.addControl(new mapboxgl.NavigationControl(), "top-left");
      document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[0].remove();

      mapSignal.value.on("click", (event) => {
        if (onMapClickAddMarker) {
          addMarker(event.lngLat);
        }

        if (removeMarker && markers?.length) {
          markers.forEach((m) => m.remove());
        }
      });

      if (addUserMarker) {
        new mapboxgl.Marker()
          .setLngLat(myLatLngSignal.value)
          .addTo(mapSignal.value);
      }

      if (moveMarkerToCenter) {
        mapSignal.value.flyTo({
          zoom: 15,
          speed: 5,
          center: myLatLngSignal.value,
        });
      }
    });
  }, []);

  const addMarker = (coordinates) => {
    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url(https://main--playful-taffy-7c5a83.netlify.app/marker.png)`;
    el.style.width = `${60}px`;
    el.style.height = `${60}px`;
    el.style.backgroundSize = "100%";
    el.style.backgroundRepeat = "no-repeat";

    // Add markers to the map.
    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(mapSignal.value);

    onMapClickAddMarker({ lat: coordinates.lat, lng: coordinates.lng }, marker);
  };

  useEffect(() => {
    if (removeMarker)
      (() => {
        // markers?.forEach((marker) => marker.remove());
      })();
  }, [markers]);
  return (
    <div
      ref={mapContainer}
      className="map-container"
      // style={{ height: "90vh", width: "100%", position: "relative" }}
      {...props}
    />
  );
};

export default MapBox;
