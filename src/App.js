import "./App.css";
import SignIn from "./SIgnIn/signin";
import SignUp from "./SignUp/signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar/navbar";
import Map from "./Map/map";
import CopyRight from "./Components/copyright";
import Home from "./Home/home";
import Detail from "./Detail/detail";
import ProtectedRoute from "./Components/protectedRoute";
import Error from "./404";
import AddRoom from "./Admin/Rooms/addRoom";
import { Alert, Snackbar, useMediaQuery } from "@mui/material";
import Profile from "./Profile/profile";
import { signal, effect, computed } from "@preact/signals-react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { getLocation, getRecordings } from "./utilities/utility";
import LoaderUi from "./Components/loaderUi";
import Configuration from "./Configuration/configuration";
import { fetchBroadcastMessage } from "./firebase";
import Recording from "./Admin/Recording/recording";

export const loader = signal(false);
export const toggleSnackBar = signal({
  isOpen: false,
  message: "",
  isError: false,
  timeOut: 3,
  isInfo: false,
});
export const myLatLngSignal = signal([]);
export const mapSignal = signal(null);

function App() {
  useEffect(() => {
    loader.value = true;
    getLocation((loc) => {
      myLatLngSignal.value = [loc.coords.longitude, loc.coords.latitude];
    });
    loader.value = false;
    fetchBroadcastMessage();
  }, []);
  effect(() => {
    if (toggleSnackBar.value.isOpen)
      setTimeout(() => {
        toggleSnackBar.value = { isOpen: false };
      }, toggleSnackBar.value.timeOut * 1000);
  });
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <>
      <Snackbar
        sx={{ zIndex: 999999 }}
        autoHideDuration={6000}
        action={
          <>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={() => (toggleSnackBar.value = { isOpen: false })}
            >
              <CloseIcon />
            </IconButton>
          </>
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        color="red"
        open={toggleSnackBar.value.isOpen}
        onClose={() => {
          toggleSnackBar.value.isOpen = !toggleSnackBar.value.isOpen;
        }}
        message={toggleSnackBar.value.message}
      >
        {(toggleSnackBar.value?.isError || toggleSnackBar.value?.isInfo) && (
          <Alert severity={toggleSnackBar.value.isError ? "error" : "info"}>
            {toggleSnackBar.value.message}
          </Alert>
        )}
      </Snackbar>
      {loader.value && (
        <div className="loader">
          <LoaderUi />
        </div>
      )}
      <BrowserRouter basename="/">
        <Navbar isMobile={isMobile}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home isMobile={isMobile} />
                </ProtectedRoute>
              }
            />
            <Route path="/login" Component={SignIn} />
            <Route path="/signup" Component={SignUp} />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Map isMobile={isMobile} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addroom"
              element={
                <ProtectedRoute role={["ADMIN"]}>
                  <AddRoom isMobile={isMobile} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuration"
              element={
                <ProtectedRoute>
                  <Configuration isMobile={isMobile} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recordings"
              element={
                <ProtectedRoute role={["ADMIN"]}>
                  <Recording isMobile={isMobile} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/detail/:id"
              element={
                <ProtectedRoute>
                  <Detail isMobile={isMobile} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile isMobile={isMobile} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </Navbar>
        <CopyRight />
      </BrowserRouter>
    </>
  );
}

export default App;
