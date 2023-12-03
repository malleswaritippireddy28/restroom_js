import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={`15045364826-pqp4n5vlei4tf7rhnsr40bi6mef9v9sf.apps.googleusercontent.com`}
    >
      <App />
    </GoogleOAuthProvider>
    ;
  </React.StrictMode>
);

reportWebVitals();
