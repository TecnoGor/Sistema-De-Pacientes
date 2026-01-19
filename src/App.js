import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
// import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { ensureThemeFunctions } from "utils/themeUtils"; // Importar el helper
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import iposLight from "assets/images/favicon.png";
import brandDark from "assets/images/logo-ct-dark.png";
import Basic from "layouts/authentication/sign-in";
import Cover from "layouts/authentication/sign-up";
import { ProtectedRoute } from "components/ProtectedRoutes";
import { Dashboard } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "context/AuthContext"; // Importar useAuth

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
  const navigate = useNavigate();

  // Usar el hook de autenticación
  const { isAuthenticated, loading, hasPermission } = useAuth();

  // Filtrar rutas según permisos usando useMemo
  const filteredRoutes = useMemo(() => {
    // Si está cargando o no autenticado, solo mostrar rutas públicas
    if (loading || !isAuthenticated) {
      return routes.filter(
        (route) => route.type === "collapse" && !route.protected && !route.requiredPermission
      );
    }

    // Para usuarios autenticados, filtrar por permisos
    return routes.filter((route) => {
      // Si es ruta pública o no protegida, mostrar
      if (!route.protected) return true;

      // Si requiere permiso específico, verificar
      if (route.requiredPermission) {
        return hasPermission(route.requiredPermission);
      }

      // Si no requiere permiso específico pero está protegida, mostrar
      return true;
    });
  }, [isAuthenticated, loading, hasPermission]);

  useEffect(() => {
    // Redirigir si no está autenticado y no está en páginas de autenticación
    if (
      !loading &&
      !isAuthenticated &&
      !pathname.includes("/authentication/") &&
      pathname !== "/"
    ) {
      navigate("/authentication/sign-in");
    }
  }, [isAuthenticated, loading, pathname, navigate]);

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
              route.protected || route.requiredPermission ? (
                <ProtectedRoute
                  requiredPermission={route.requiredPermission}
                  requiredAny={route.requiredAny}
                  requiredAll={route.requiredAll}
                >
                  {route.component}
                </ProtectedRoute>
              ) : (
                route.component
              )
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
  if (loading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress color="info" />
      </MDBox>
    );
  }

  // Función para renderizar el contenido principal
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  const getSafeTheme = () => {
    let selectedTheme;

    if (direction === "rtl") {
      selectedTheme = darkMode ? themeDarkRTL : themeRTL;
    } else {
      selectedTheme = darkMode ? themeDark : theme;
    }

    // Asegurar que el tema tenga todas las funciones necesarias
    return ensureThemeFunctions(selectedTheme);
  };

  const currentTheme = getSafeTheme();

  const renderContent = (themeToUse) => (
    <ThemeProvider theme={themeToUse}>
      <CssBaseline />
      {layout === "dashboard" && isAuthenticated && (
        <>
          {/* <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? iposLight : iposLight}
            brandName="SIRHOS"
            routes={filteredRoutes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          /> */}
          <Configurator />
          {/* {configsButton} */}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(filteredRoutes)}
        <Route path="/authentication/sign-in" element={<Basic />} />
        <Route path="/authentication/sign-up" element={<Cover />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/authentication/sign-in" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/authentication/sign-in" replace />
            )
          }
        />
      </Routes>
    </ThemeProvider>
  );

  // Resto de tu código sin cambios...
  // [Mantén el resto de tu App.js igual, pero usa currentTheme]

  // const renderContent = () => (
  //   <ThemeProvider theme={currentTheme}>
  //     <CssBaseline />
  //     {/* ... resto del contenido */}
  //   </ThemeProvider>
  // );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}> {renderContent(currentTheme)} </CacheProvider>
  ) : (
    renderContent(currentTheme)
  );
}
