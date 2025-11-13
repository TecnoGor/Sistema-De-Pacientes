import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { CircularProgress } from "@mui/material";

function InfoPaciente({ show, close, fetch, id_persona }) {
  const id = id_persona;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_Host = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    personaId: null,
    dpersonalesId: null,
    typeCi: "V",
    ci: "",
    firstname: "",
    lastname: "",
    mail: "",
    phone: "",
    bdate: "",
    scivil: "",
    studios: "",
    ocupation: "",
    state: "",
    municipio: "",
    parroquia: "",
    dirhouse: "",
    typePaciente: "",
    referencia: null,
    carnetM: "",
    gradoM: "",
    componentM: "",
    carnetA: "",
    exception: false,
    exceptionD: "",
  });

  // Opciones para los selects
  const tipoCedulaOptions = ["V", "E", "J", "P"];
  const estadoCivilOptions = [
    "Soltero(a)",
    "Casado(a)",
    "Divorciado(a)",
    "Viudo(a)",
    "Unión Libre",
  ];
  const tipoPacienteOptions = ["Militar", "Civil", "Familiar"];
  const gradosMilitares = [
    "General de División",
    "General de Brigada",
    "Coronel",
    "Teniente Coronel",
    "Mayor",
    "Capitán",
    "Teniente",
    "Subteniente",
    "Sargento Supervisor",
    "Sargento Ayudante",
    "Sargento Mayor de Tercera",
    "Sargento Mayor de Segunda",
    "Sargento Mayor de Primera",
    "Sargento Segundo",
    "Sargento Primero",
    "Cabo",
    "Distinguido",
    "Soldado",
  ];
  const componentesMilitares = ["Ejército", "Armada", "Aviación", "Guardia Nacional", "Milicianos"];

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Aquí puedes agregar la lógica para guardar los cambios
    console.log("Guardando cambios...", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Aquí puedes agregar la lógica para cancelar los cambios
    setIsEditing(false);
  };

  const fetchPaciente = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_Host}/api/paciente/${id}`);
      const pacienteData = response.data;
      // Mapear los datos de la API al estado del formulario
      setFormData({
        personaId: pacienteData.id_persona || null,
        dpersonalesId: pacienteData.id_dpersonales || null,
        typeCi: pacienteData.tipoci || "V",
        ci: pacienteData.cedula || "",
        firstname: pacienteData.nombres || "",
        lastname: pacienteData.apellidos || "",
        mail: pacienteData.correo || "",
        phone: pacienteData.telefono || "",
        bdate: pacienteData.fechanac || "",
        scivil: pacienteData.edocivil || "",
        studios: pacienteData.nivinst || "",
        ocupation: pacienteData.profesion || "",
        state: pacienteData.estado || "",
        municipio: pacienteData.municipio || "",
        parroquia: pacienteData.parroquia || "",
        dirhouse: pacienteData.direccion || "",
        typePaciente: pacienteData.tipopaciente || "",
        carnetM: pacienteData.carnetm || "",
        gradoM: pacienteData.gradom || "",
        componentM: pacienteData.componentm || "",
        carnetA: pacienteData.carneta || "",
        exception: pacienteData.excepcion || false,
        exceptionD: pacienteData.excepcion || "",
        referencia: pacienteData.referencia || null,
      });
      console.log(formData);
    } catch (err) {
      console.error("Error al obtener datos del paciente:", err);
      setError("Error al cargar los datos del paciente. Inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && id) {
      fetchPaciente();
    }
  }, [show, id]);

  // try {
  //   const result = await axios.get(`${API_Host}/api/paciente/${id}`);

  // } catch {

  // }

  return (
    <Modal
      show={show}
      onHide={close}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Informacion de Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MDBox>
          {/* Botón de Edición */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            {!isEditing ? (
              <MDButton
                variant="gradient"
                color="info"
                onClick={toggleEditing}
                startIcon={<Icon>edit</Icon>}
                disabled
              >
                Editar Información
              </MDButton>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <MDButton
                  variant="gradient"
                  color="success"
                  onClick={handleSave}
                  startIcon={<Icon>save</Icon>}
                >
                  Guardar Cambios
                </MDButton>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  startIcon={<Icon>cancel</Icon>}
                >
                  Cancelar
                </MDButton>
              </Box>
            )}
          </Box>

          {/* Sección 1: Datos Personales Básicos */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <MDTypography variant="h6" gutterBottom color="primary">
                Datos Personales Básicos
              </MDTypography>

              <Grid container spacing={3}>
                {/* Tipo de Cédula */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Cédula</InputLabel>
                    <Select
                      name="typeCi"
                      value={formData.typeCi || ""}
                      label="Tipo de Cédula"
                      disabled={!isEditing}
                    >
                      {tipoCedulaOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Cédula */}
                <Grid item xs={12} sm={6} md={3}>
                  <MDInput
                    label="Cédula"
                    name="ci"
                    value={formData.ci || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Nombres */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Nombres"
                    name="firstname"
                    value={formData.firstname || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Apellidos */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Apellidos"
                    name="lastname"
                    value={formData.lastname || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Correo Electrónico */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Correo Electrónico"
                    name="mail"
                    value={formData.mail || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Teléfono */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Teléfono"
                    name="phone"
                    value={formData.phone || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Fecha de Nacimiento */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Fecha de Nacimiento"
                    name="bdate"
                    type="date"
                    value={formData.bdate || ""}
                    fullWidth
                    disabled={!isEditing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Estado Civil */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Estado Civil</InputLabel>
                    <Select
                      name="scivil"
                      value={formData.scivil || ""}
                      label="Estado Civil"
                      disabled={!isEditing}
                    >
                      {estadoCivilOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Sección 2: Datos Personales Complementarios */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <MDTypography variant="h6" gutterBottom color="primary">
                Datos Personales Complementarios
              </MDTypography>

              <Grid container spacing={3}>
                {/* Estudios */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Nivel de Estudios"
                    name="studios"
                    value={formData.studios || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Ocupación */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Ocupación"
                    name="ocupation"
                    value={formData.ocupation || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Estado */}
                <Grid item xs={12} sm={4}>
                  <MDInput
                    label="Estado"
                    name="state"
                    value={formData.state || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Municipio */}
                <Grid item xs={12} sm={4}>
                  <MDInput
                    label="Municipio"
                    name="municipio"
                    value={formData.municipio || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Parroquia */}
                <Grid item xs={12} sm={4}>
                  <MDInput
                    label="Parroquia"
                    name="parroquia"
                    value={formData.parroquia || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Dirección de Habitación */}
                <Grid item xs={12}>
                  <TextField
                    label="Dirección de Habitación"
                    name="dirhouse"
                    value={formData.dirhouse || ""}
                    fullWidth
                    multiline
                    rows={3}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Sección 3: Datos del Paciente */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <MDTypography variant="h6" gutterBottom color="primary">
                Datos del Paciente
              </MDTypography>

              <Grid container spacing={3}>
                {/* Tipo de Paciente */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Paciente</InputLabel>
                    <Select
                      name="typePaciente"
                      value={formData.typePaciente || ""}
                      label="Tipo de Paciente"
                      disabled={!isEditing}
                    >
                      {tipoPacienteOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Campos Militares - Solo se muestran si existe valor */}
                {formData.carnetM && (
                  <Grid item xs={12} sm={6}>
                    <MDInput
                      label="Carnet Militar"
                      name="carnetM"
                      value={formData.carnetM || ""}
                      fullWidth
                      disabled={!isEditing}
                    />
                  </Grid>
                )}

                {formData.gradoM && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Grado Militar</InputLabel>
                      <Select
                        name="gradoM"
                        value={formData.gradoM || ""}
                        label="Grado Militar"
                        disabled={!isEditing}
                      >
                        {gradosMilitares.map((grado) => (
                          <MenuItem key={grado} value={grado}>
                            {grado}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {formData.componentM && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Componente Militar</InputLabel>
                      <Select
                        name="componentM"
                        value={formData.componentM || ""}
                        label="Componente Militar"
                        disabled={!isEditing}
                      >
                        {componentesMilitares.map((componente) => (
                          <MenuItem key={componente} value={componente}>
                            {componente}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {/* Carnet Académico - Solo se muestra si existe valor */}
                {formData.carnetA && (
                  <Grid item xs={12} sm={6}>
                    <MDInput
                      label="Carnet Académico"
                      name="carnetA"
                      value={formData.carnetA || ""}
                      fullWidth
                      disabled={!isEditing}
                    />
                  </Grid>
                )}

                {/* Sección de Excepción - Solo se muestra si existe valor */}
                {(formData.exceptionD || formData.exception) && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ backgroundColor: "#f5f5f5" }}>
                      <CardContent>
                        <MDTypography variant="h6" color="primary" gutterBottom>
                          Datos de Excepción
                        </MDTypography>

                        <Grid container spacing={2}>
                          {/* Checkbox de Excepción */}
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="exception"
                                  checked={formData.exception || false}
                                  color="primary"
                                  disabled={!isEditing}
                                />
                              }
                              label="¿Aplica para excepción?"
                            />
                          </Grid>

                          {/* Descripción de Excepción */}
                          {formData.exceptionD && (
                            <Grid item xs={12}>
                              <TextField
                                label="Descripción de la Excepción"
                                name="exceptionD"
                                value={formData.exceptionD || ""}
                                fullWidth
                                multiline
                                rows={3}
                                disabled={!isEditing}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </MDBox>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

InfoPaciente.defaultProps = {
  show: false,
};

InfoPaciente.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  fetch: PropTypes.func,
  id_persona: PropTypes.number,
};

export default InfoPaciente;
