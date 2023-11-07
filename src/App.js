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

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Navbar>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" Component={SignIn} />
            <Route path="/signup" Component={SignUp} />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addroom"
              element={
                <ProtectedRoute role={["ADMIN"]}>
                  <AddRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/detail/:id"
              element={
                <ProtectedRoute>
                  <Detail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </Navbar>
        {/* <CopyRight /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
