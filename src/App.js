import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import iposLight from "assets/images/favicon.png";
import brandDark from "assets/images/logo-ct-dark.png";
import Basic from "layouts/authentication/sign-in"; // Asegúrate de que esta ruta es correcta
import Cover from "layouts/authentication/sign-up";
import { ProtectedRoute } from "components/ProtectedRoutes";
import { Dashboard } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const API_Host = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // Usa el hook de autenticación
  // const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Verificar autenticación al cargar el dashboard
    const token = localStorage.getItem("authToken");
    if (
      !token &&
      pathname !== "/authentication/sign-in" &&
      pathname !== "/authentication/sign-up"
    ) {
      navigate("/authentication/sign-in");
    }
  }, [navigate, pathname]);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

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

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

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
        return (
          <Route
            exact
            path={route.route}
            element={
              route.protected ? <ProtectedRoute>{route.component}</ProtectedRoute> : route.component
            }
            key={route.key}
          />
        );
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

  // Mostrar loading mientras verifica autenticación
  // if (loading) {
  //   return (
  //     <MDBox display="flex" justifyContent="center" alignItems="center" height="100vh">
  //       <div>Cargando...</div>
  //     </MDBox>
  //   );
  // }

  // Función para renderizar el contenido principal
  const renderContent = (themeToUse) => (
    <ThemeProvider theme={themeToUse}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? iposLight : iposLight}
            brandName="Sistema de Camaras Hiperbaricas"
            routes={routes.filter(
              (route) => !route.hideWhenUnauthenticated || localStorage.getItem("authToken")
            )}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {/* {configsButton} */}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(routes)}
        <Route path="/authentication/sign-in" element={<Basic />} />
        <Route path="/authentication/sign-up" element={<Cover />} />
        <Route
          path="*"
          element={
            localStorage.getItem("authToken") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/authentication/sign-in" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ThemeProvider>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      {renderContent(darkMode ? themeDarkRTL : themeRTL)}
    </CacheProvider>
  ) : (
    renderContent(darkMode ? themeDark : theme)
  );
}
