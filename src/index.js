import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { AuthContextProvider } from "context/AuthContext"

ReactDOM.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
