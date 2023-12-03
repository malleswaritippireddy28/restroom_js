import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import * as turf from "@turf/turf";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import * as ReactDOMServer from "react-dom/server";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  addRoom,
  addRoomTransactionToDB,
  getLocation,
  getRoomDetail,
  getToken,
  mapToken,
} from "../utilities/utility";
import mapboxgl from "mapbox-gl";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Link, Rating } from "@mui/material";
import { loader } from "../App";
import { signal, effect } from "@preact/signals-react";
import {
  addComment,
  addRoomRating,
  addRoomTransaction,
  commentsSignal,
  fetchRoomDetails,
  roomDRatinglSignal,
} from "../firebase";
import SendIcon from "@mui/icons-material/Send";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

const mySound = require("../whatsapp_original.mp3");

const Detail = ({ isMobile }) => {
  mapboxgl.accessToken = mapToken();
  const [dateRange, setDateRange] = useState({ start: 0, end: 0 });
  const [enableCommentBtn, setEnableCommentBtn] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [reply, setReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { id } = useParams();

  const mapContainer = useRef(null);
  const [latLng, setLatLng] = useState([]);
  const [zoom, setZoom] = useState(9);
  const [roomDdetails, setRoomDdetails] = useState(null);
  const audio = document.getElementById("audio_tag");
  useEffect(() => {}, []);

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
            <b>Rating</b> <b>{roomDRatinglSignal.value}</b>
          </div>
          <p>{roomDdetails.description}</p>
        </div>
      </div>
    );
  };

  const getDetail = async (id) => {
    if (id) {
      await fetchRoomDetails(id);
    }
    loader.value = true;
    const response = await getRoomDetail(id);
    setRoomDdetails(response);
    let map = map_.current;
    var coordinates = [response.lng, response.lat];
    if (marker) marker.remove();
    map.flyTo({
      zoom: 15,
      speed: 5,
    });

    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url(https://main--playful-taffy-7c5a83.netlify.app/marker.png)`;
    el.style.width = `${60}px`;
    el.style.height = `${60}px`;
    el.style.backgroundSize = "100%";
    el.style.backgroundRepeat = "no-repeat";
    var from = turf.point(coordinates);
    var to = turf.point(latLng);
    var options = { units: "miles" };
    var distance = turf.distance(from, to, options);
    // Add markers to the map.
    new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 35 })
          .setLngLat(coordinates)
          .setHTML(
            ReactDOMServer.renderToString(
              <RawMarkup roomDdetails={response} distance={distance} />
            )
          )
      )
      .addTo(map)
      .togglePopup();

    await axios
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${
          coordinates[0]
        },${coordinates[1]};${latLng[0]},${
          latLng[1]
        }?geometries=geojson&access_token=${mapToken()}`
      )
      .then((res) => {
        const coords = res.data.routes[0]?.geometry?.coordinates;
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          },
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": [
              // => using feature-state expression, that checks feature.properties.road_class value
              "match",
              ["get", "road_class"],
              "motorway",
              "#009933",
              "trunk",
              "#00cc99",
              "primary",
              "#009999",
              "secondary",
              "#00ccff",
              "tertiary",
              "#9999ff",
              "residential",
              "#9933ff",
              "service_other",
              "#ffcc66",
              "unclassified",
              "#666699",
              /* other */
              "#666699",
            ],
            "line-width": 8,
          },
        });
        // const bounds = [coordinates, latLng];
        // map.setMaxBounds(bounds);
        console.log(coordinates);
        map.flyTo({
          zoom: 15,
          speed: 5,
        });
        loader.value = false;
      })
      .finally(() => (loader.value = false));
  };

  const map_ = useRef(null);
  var marker = null;
  useEffect(() => {
    getLocation((loc) => {
      if (latLng.length === 0)
        setLatLng([loc.coords.longitude, loc.coords.latitude]);
    });
    if (!map_.current && latLng.length === 0) return; // initialize map only once
    map_.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: latLng,
      zoom: zoom,
    });
    document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[0].remove();

    new mapboxgl.Marker()
      .setLngLat(latLng)
      .setPopup(
        new mapboxgl.Popup({ offset: 35 })
          .setLngLat(latLng)
          .setHTML(`<h1>You</h1>`)
      )
      .addTo(map_.current)
      .togglePopup();

    map_.current.addControl(new mapboxgl.NavigationControl(), "top-left");

    if (id) getDetail(id);
  }, [latLng, id]);

  const sortComments = (comments) => {
    return comments.sort(function (a, b) {
      var x = a.tstamp;
      var y = b.tstamp;
      return x > y ? -1 : x < y ? 1 : 0;
    });
  };

  const [r, sR] = useState(0);
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Typography component="h1" variant="h5">
          {roomDdetails?.name}
        </Typography>
      </div>
      <Box component="form" noValidate onSubmit={() => {}} sx={{ mt: 3 }}>
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
            <Rating
              name="simple-controlled"
              value={r}
              onChange={async (event, newValue) => {
                sR(newValue);
                await addRoomRating(id, newValue);
              }}
            />
          </Grid>
          {getToken()?.isAdmin && (
            <Grid item xs={12}>
              <Typography component={"h1"}>Set Under Maintenance</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  onChange={(e) => {
                    setDateRange({
                      ...dateRange,
                      start: new Date(e.$d).getTime(),
                    });
                  }}
                />
                &nbsp;
                <DateTimePicker
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      end: new Date(e.$d).getTime(),
                    })
                  }
                />
                &nbsp;
                <Button
                  variant="contained"
                  disabled={loader.value}
                  endIcon={loader.value && <CircularProgress />}
                  onClick={async () => {
                    await addRoomTransactionToDB({ ...dateRange, id });
                  }}
                >
                  Save
                </Button>
              </LocalizationProvider>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              required
              hidden
              disabled
              fullWidth
              name="password"
              helperText="Rooom Name"
              value={roomDdetails?.name}
              id="password"
              autoComplete="new-password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              hidden
              disabled
              fullWidth
              name="password"
              helperText="Friendly Address"
              value={roomDdetails?.location}
              id="password"
              autoComplete="new-password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              hidden
              disabled
              fullWidth
              name="password"
              helperText="Description"
              value={roomDdetails?.description}
              id="password"
              autoComplete="new-password"
            />
          </Grid>
        </Grid>
        <Grid container sx={{ marginTop: 2 }}>
          <Typography variant="h5">
            {commentsSignal.value &&
              commentsSignal.value?.comments?.filter((x) => !x.isReply)?.length}
            &nbsp; Comments
          </Typography>
        </Grid>
        <Grid container sx={{ marginTop: 2, wordBreak: "break-word" }}>
          <Grid xs={12}>
            <Grid
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "end",
              }}
            >
              <Avatar sx={{ mr: 2 }}>
                <svg
                  class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiAvatar-fallback css-13y7ul3"
                  focusable="false"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  data-testid="PersonIcon"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
              </Avatar>
              <TextField
                label="Add a comment"
                variant="standard"
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => {
                  setEnableCommentBtn(true);
                }}
                onBlur={() => {
                  if (!getToken().isAdmin) return;
                  if (!commentText) setEnableCommentBtn(false);
                }}
                fullWidth
                value={commentText}
              />
            </Grid>
            {enableCommentBtn && (
              <Button
                variant="contained"
                sx={{ float: "right", mt: 2 }}
                endIcon={<SendIcon />}
                onClick={async () => {
                  audio.play();
                  loader.value = true;
                  await addComment(
                    roomDdetails._id,
                    roomDdetails.name,
                    commentText
                  );
                  setCommentText("");
                  setEnableCommentBtn(false);
                  loader.value = false;
                }}
              >
                Send
              </Button>
            )}
          </Grid>

          {commentsSignal.value.comments &&
            sortComments(commentsSignal?.value?.comments).map((c) => {
              return (
                !c.isReply && (
                  <Grid container spacing={0} xs={12} sx={{ mt: 5 }}>
                    {!c.isReply && (
                      <>
                        <Grid item xs={1}>
                          <Avatar sx={{ bgcolor: c.userIconColor, mr: 2 }}>
                            {c.name.toUpperCase()[0]}
                          </Avatar>
                        </Grid>
                        <Grid item xs={11}>
                          <b>{c.name}</b>
                          <i style={{ marginLeft: 20, color: "grey" }}>
                            {new TimeAgo("en-US").format(c.tstamp)}
                          </i>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={11}>
                          <div>
                            <div>
                              <div>
                                <div style={{ width: "100%" }}>{c.text}</div>
                              </div>
                              <div>
                                {getToken().isAdmin && c.reply && (
                                  <>
                                    <TextField
                                      xs={12}
                                      variant="standard"
                                      onChange={(e) =>
                                        setReplyText(e.target.value)
                                      }
                                      fullWidth
                                      value={replyText}
                                    />
                                    <Link
                                      component="button"
                                      variant="body2"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const comments =
                                          commentsSignal.value.comments.map(
                                            (x) => {
                                              if (x.id === c.id) {
                                                c.reply = false;
                                              }
                                              return x;
                                            }
                                          );
                                        commentsSignal.value = {
                                          ...commentsSignal.value,
                                          comments: [...comments],
                                        };
                                      }}
                                    >
                                      Cancel
                                    </Link>
                                    <Link
                                      component="button"
                                      variant="body2"
                                      sx={{ ml: 5 }}
                                      onClick={async (e) => {
                                        e.preventDefault();
                                        const comments =
                                          commentsSignal.value.comments.map(
                                            (x) => {
                                              if (x.id === c.id) {
                                                c.reply = false;
                                              }
                                              return x;
                                            }
                                          );
                                        commentsSignal.value = {
                                          ...commentsSignal.value,
                                          comments: [...comments],
                                        };
                                        audio.play();
                                        await addComment(
                                          roomDdetails._id,
                                          roomDdetails.name,
                                          replyText,
                                          c.id
                                        );
                                        setReplyText("");
                                      }}
                                    >
                                      Send
                                    </Link>
                                  </>
                                )}
                                {getToken().isAdmin && !c.reply && (
                                  <Link
                                    component="button"
                                    variant="body2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const comments =
                                        commentsSignal.value.comments.map(
                                          (x) => {
                                            if (x.id === c.id) {
                                              c.reply = true;
                                            }
                                            return x;
                                          }
                                        );
                                      commentsSignal.value = {
                                        ...commentsSignal.value,
                                        comments: [...comments],
                                      };
                                    }}
                                  >
                                    Reply
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </>
                    )}

                    {commentsSignal?.value?.comments?.map((i) => {
                      if (i.isReply && c.id == i.toID) {
                        return (
                          <Grid container spacing={0} xs={12} sx={{ mt: 1 }}>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={1}>
                              <Avatar sx={{ bgcolor: i.userIconColor, mr: 2 }}>
                                {i.name.toUpperCase()[0]}
                              </Avatar>
                            </Grid>
                            <Grid item xs={9}>
                              <b>{i.name}</b>
                              <i style={{ marginLeft: 20, color: "grey" }}>
                                {new TimeAgo("en-US").format(i.tstamp)}
                              </i>
                            </Grid>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={8}>
                              <div>
                                <div>
                                  <div>
                                    <div style={{ width: "100%" }}>
                                      {i.text}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                )
              );
            })}
        </Grid>
        <audio id="audio_tag" src={mySound} />
      </Box>
    </>
  );
};

export default Detail;
