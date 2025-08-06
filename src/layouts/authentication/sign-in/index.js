/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";
import axios from "axios";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "context/AuthContext";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bgHPVSS.jpg";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Llamada a tu API de login
      const response = await axios.post(
        "http://localhost:5000/login",
        {
          username,
          password,
        },
        {
          timeout: 5000,
        }
      );

      if (response.data.token) {
        // Guardar el token en localStorage o en el estado global
        localStorage.setItem("authToken", response.data.token);
        // Redireccionar al dashboard o página principal
        navigate("/dashboard");
      } else {
        setError("Credenciales inválidas o error en el servidor");
      }
    } catch (err) {
      // Manejo de errores específicos
      console.error("Error completo en login:", err); // Para depuración
      if (err.code === "ECONNABORTED") {
        setError("El servidor no respondió a tiempo");
      } else if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        if (err.response.status === 401) {
          setError("Usuario o contraseña incorrectos");
        } else if (err.response.status === 500) {
          setError("Error interno del servidor");
        } else {
          setError(`Error del servidor (${err.response.status})`);
        }
      } else if (err.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setError("No se pudo conectar al servidor. Verifique:");
        setError((prev) => prev + "\n- Que el backend esté corriendo");
        setError((prev) => prev + "\n- Que la URL sea correcta");
        setError((prev) => prev + "\n- Que no haya problemas de CORS");
      } else {
        // Algo pasó al configurar la solicitud
        setError("Error al configurar la solicitud: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Iniciar Sesion en el Sistema Integral de Gestion de Pacientes de Camaras Hiperbáricas
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <form>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Usuario"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Contraseña"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </MDBox>
              {error && (
                <MDBox mb={2} color="error">
                  {error}
                </MDBox>
              )}
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </MDButton>
              </MDBox>
            </form>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                ¿No tienes una cuenta?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Registrate
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
