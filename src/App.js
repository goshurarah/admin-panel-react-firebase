import { useState, useEffect, useContext } from "react";
import * as React from 'react'

// react-router components
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Amdin panel React components
import MDBox from "components/MDBox";

// Amdin panel React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Amdin panel React themes
import theme from "assets/theme";

// Amdin panel React Dark Mode themes
import themeDark from "assets/theme-dark";

// Routes
import { AuthContext } from "context/AuthContext";
import routes, { authRoutes } from "routes";
import Login from "layouts/authentication/users/Login"

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Amdin panel React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

function App() {
  const { role } = useContext(AuthContext)
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });
  const getAuthRoutes = (allAuthRoutes) =>
    allAuthRoutes.map((route) => {
      if (route.route && route.routeRole === role) {
        return <Route exact path={route.route} element={route.component} />;
      }
      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );
  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "/admin/dashboard" && (
        <>
          {role && <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName={role === "admin" ? "Admin Panel" : role === "brand" ? "Brand Panel" : role === "bank" ? "Bank Panel" : ''}
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />}
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        <Route path="/login" element={<Login />} />
        {getRoutes(routes)}
        {getAuthRoutes(authRoutes)}
        {role === null ? <Route path="*" element={<Navigate to={`/login`} />} /> : <Route path="*" element={<Navigate to={`/${role}/dashboard`} />} />}
      </Routes>
    </ThemeProvider>
  );
}
export default App