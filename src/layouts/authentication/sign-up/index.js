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

// react-router-dom components
import { useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const [formData, setFormData] = useState({
    id_persona: "",
    firstname: "",
    lastname: "",
    ci: "",
    username: "",
    password: "",
    typeCi: "V",
    status: 1,
    rol: 2,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const API_Host = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("✅ Formulario prevenido correctamente");
    setError("");
    setLoading(true);

    if (!agreeTerms) {
      setError("Debes aceptar los términos y condiciones");
      setLoading(false);
      return;
    }
    try {
      const dataPersona = {
        ci: formData.ci,
        typeCi: formData.typeCi,
        firstname: formData.firstname,
        lastname: formData.lastname,
      };
      console.log(dataPersona);

      const response = await axios.post(`${API_Host}/api/regPersona`, dataPersona, {
        timeout: 5000,
      });

      if (response.status === 201) {
        // Registro exitoso, redirigir al login
        const id_persona = response.data.id_persona;
        if (!id_persona) {
          throw new Error("No se recibió id_persona del registro");
        }
        const dataUsuario = {
          id_persona: id_persona,
          username: formData.username,
          password: formData.password,
          status: formData.status,
          rol: formData.rol,
        };

        const responseUsuario = await axios.post(`${API_Host}/api/regUser`, dataUsuario, {
          timeout: 5000,
        });

        if (responseUsuario.status === 201) {
          setFormData({
            firstname: "",
            lastname: "",
            ci: "",
            mail: "",
            phone: "",
            username: "",
            password: "",
            status: 1,
            rol: 2,
          });
          navigate("/authentication/sign-in", {
            state: { message: "Registro exitoso. Ahora puedes iniciar sesión." },
          });
        }
      }
    } catch (err) {
      console.error("Error completo en registro:", err);

      if (err.response) {
        console.error("Respuesta de error del servidor:", err.response.data);
        console.error("Status code:", err.response.status);
        console.error("Headers:", err.response.headers);

        // Manejar diferentes tipos de errores de la API
        if (err.response.status === 400) {
          setError("Datos inválidos: " + (err.response.data.error || "Verifica la información"));
        } else if (err.response.status === 409) {
          setError(
            "El usuario ya existe: " + (err.response.data.error || "Cédula o usuario ya registrado")
          );
        } else if (err.response.status === 500) {
          setError(
            "Error interno del servidor: " + (err.response.data.error || "Intenta más tarde")
          );
        } else {
          setError(err.response.data.error || `Error del servidor (${err.response.status})`);
        }
      } else if (err.request) {
        console.error("No se recibió respuesta:", err.request);
        setError("No se pudo conectar al servidor. Verifica tu conexión.");
      } else {
        console.error("Error en la configuración:", err.message);
        setError("Error al configurar la solicitud: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <CoverLayout image={bgImage}>
      <MDBox display="flex" justifyContent="center" alignItems="center" width="30vw">
        <Card
          sx={{
            top: "-5rem",
            left: "-2rem",
            width: { xs: "90%", sm: "80%", md: "500px", lg: "100%" }, // Ajusta estos valores
            maxWidth: "600px", // Ancho máximo
            margin: "auto auto", // Centrado horizontal
          }}
        >
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Regístrate
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Ingresa tus datos para crear una cuenta
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <form onSubmit={handleSubmit}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Nombre"
                  variant="standard"
                  fullWidth
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Apellido"
                  variant="standard"
                  fullWidth
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Cédula"
                  variant="standard"
                  fullWidth
                  name="ci"
                  value={formData.ci}
                  onChange={handleChange}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Usuario"
                  variant="standard"
                  fullWidth
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Contraseña"
                  variant="standard"
                  fullWidth
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </MDBox>
              {error && (
                <MDBox mb={2} color="error">
                  <MDTypography variant="caption" color="error">
                    {error}
                  </MDTypography>
                </MDBox>
              )}
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Acepto los&nbsp;
                </MDTypography>
                <MDTypography
                  component="a"
                  href="#"
                  variant="button"
                  fontWeight="bold"
                  color="info"
                  textGradient
                >
                  Términos y Condiciones
                </MDTypography>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Registrarse"}
                </MDButton>
              </MDBox>
            </form>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                ¿Ya tienes una cuenta?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Inicia Sesión
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </CoverLayout>
  );
}

export default Cover;
