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
            <Route path="/" element={ <Home />} />
            <Route path="/login" Component={SignIn} />
            <Route path="/signup" Component={SignUp} />
            <Route path="/map" element={ <Map />} />
            <Route path="/addroom" element={ <AddRoom />} />
            <Route path="/detail/:id" element={ <Detail />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Navbar>
        {/* <CopyRight /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
