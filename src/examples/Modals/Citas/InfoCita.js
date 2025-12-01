import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
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
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

function InfoCita({ show, close, fetch, id_conmed }) {
  const id = id_conmed;
  const [showInfo, setShowInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdvance, setIsAdvance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [getId, setGetId] = useState(null);
  const API_Host = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    codconsul: "",
    nombres_paciente: "",
    apellidos_paciente: "",
    cedula_paciente: "",
    correo_paciente: "",
    telefono_paciente: "",
    fechaconsul: "",
    nombres_medico: "",
    apellidos_medico: "",
    cedula_medico: "",
    diagnostic: "",
    tratment: "",
  });
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("us-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const formatToYYYYMMDD = (dateString) => {
    if (!dateString) return "2025-08-09"; // Fecha por defecto en formato correcto

    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      return "2025-08-09";
    }
  };

  // const toggleEditing = () => {
  //   setIsEditing(!isEditing);
  // };

  const toggleAdvance = () => {
    setIsAdvance(true);
  };

  const handleSave = async () => {
    // Aquí puedes agregar la lógica para guardar los cambios
    console.log("Guardando cambios...", formData);
    try {
      const result = await axios.post(`${API_Host}/api/regAdvanceConsul`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (result.status === 201) {
        Swal.fire({
          title: "Consulta Registrada!",
          text: "Consulta Agendada con exito.",
          icon: "success",
          draggable: true,
        });
        fetch();
      }
    } catch (error) {
      Swal.fire({
        title: "Error al realizar el avance.",
        text: error.message,
        icon: "error",
        draggable: true,
      });
    }
    setIsAdvance(false);
  };

  const handleCancel = () => {
    // Aquí puedes agregar la lógica para cancelar los cambios
    setIsAdvance(false);
  };

  const fetchCita = async () => {
    if (!id) return;
    // console.log(id);

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_Host}/api/consultaMedica/${id}`);
      const citaData = response.data;
      // console.log(citaData);
      // Mapear los datos de la API al estado del formulario
      setFormData({
        codconsul: citaData.codconsul,
        nombres_paciente: citaData.nombres_paciente,
        apellidos_paciente: citaData.apellidos_paciente,
        cedula_paciente: citaData.cedula_paciente,
        correo_paciente: citaData.correo_paciente,
        telefono_paciente: citaData.telefono_paciente,
        fechaconsul: formatToYYYYMMDD(citaData.fechaconsul),
        nombres_medico: citaData.nombres_medico,
        apellidos_medico: citaData.apellidos_medico,
        cedula_medico: citaData.cedula_medico,
        diagnostic: citaData.diagnostic,
        tratment: citaData.tratment,
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
      fetchCita();
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
        <Modal.Title id="contained-modal-title-vcenter">Datos de Cita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MDBox>
          {/* Botón de Edición */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            {!isAdvance ? (
              <MDButton
                variant="gradient"
                color="info"
                onClick={toggleAdvance}
                startIcon={<Icon>edit</Icon>}
              >
                Registrar Avance
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
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <MDTypography variant="h6" gutterBottom color="primary">
                Datos de Consulta
              </MDTypography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <MDInput
                    label="Codigo de Consulta"
                    name="codconsul"
                    value={formData.codconsul || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MDInput
                    label="Diagnostico"
                    name="diagnostic"
                    type="text"
                    value={formData.diagnostic || ""}
                    fullWidth
                    disabled={!isEditing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MDInput
                    label="Tratamiento"
                    name="tratment"
                    type="text"
                    value={formData.tratment || ""}
                    fullWidth
                    disabled={!isEditing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Sección 1: Datos Personales Básicos */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <MDTypography variant="h6" gutterBottom color="primary">
                Datos de Paciente
              </MDTypography>

              <Grid container spacing={3}>
                {/* Tipo de Cédula */}
                {/* <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Cédula</InputLabel>
                    <Select
                      name="firstnameP"
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
                </Grid> */}

                {/* Cédula */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Cédula"
                    name="cedula_paciente"
                    value={formData.cedula_paciente || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Nombres */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Nombres"
                    name="nombres_paciente"
                    value={formData.nombres_paciente || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Apellidos */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Apellidos"
                    name="apellidos_paciente"
                    value={formData.apellidos_paciente || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Correo Electrónico */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Correo Electrónico"
                    name="correo_paciente"
                    value={formData.correo_paciente || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Teléfono */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Teléfono"
                    name="telefono_paciente"
                    value={formData.telefono_paciente || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Fecha de Nacimiento */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Fecha de Consulta"
                    name="fechaconsul"
                    type="date"
                    value={formData.fechaconsul || ""}
                    fullWidth
                    disabled={!isEditing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Sección 2: Datos Personales Complementarios */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <MDTypography variant="h6" gutterBottom color="primary">
                Datos de Medico
              </MDTypography>

              <Grid container spacing={3}>
                {/* Estudios */}
                <Grid item xs={12} sm={4}>
                  <MDInput
                    label="Cedula"
                    name="cedula_medico"
                    value={formData.cedula_medico || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MDInput
                    label="Nombres"
                    name="nombres_medico"
                    value={formData.nombres_medico || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>
                {/* Ocupación */}
                <Grid item xs={12} sm={4}>
                  <MDInput
                    label="Apellidos"
                    name="apellidos_medico"
                    value={formData.apellidos_medico || ""}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {isAdvance && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <MDTypography variant="h6" gutterBottom color="primary">
                  Registrar Avance / Finalizar
                </MDTypography>

                <Grid container spacing={3}>
                  {/* Estudios */}
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Diagnostico"
                      name="diagnostico_avance"
                      value={formData.cedula_medico || ""}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Tiempo de Tratamiento"
                      name="tiempo_tratamiento"
                      value={formData.cedula_medico || ""}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Proxima Cita"
                      name="fecha_avance"
                      value={formData.nombres_medico || ""}
                      fullWidth
                    />
                  </Grid>
                  {/* Ocupación */}
                  <Grid item xs={12} sm={4}>
                    <Form.Group className="mb-3" controlId="tipoCed.ControlSelect1">
                      <Form.Label>Estado del Paciente</Form.Label>
                      <Form.Select
                        aria-label="Seleccionar estado"
                        value={formData.medicoid || ""}
                        name="medicoid"
                        required
                      >
                        <option value="" disabled>
                          Seleccione...
                        </option>
                        <option value="Curado"> Curado </option>
                        <option value="En proceso de Mejora"> En proceso de Mejora </option>
                        <option value="Empeoro"> Empeoro </option>
                        <option value="Estado Critico"> Estado Critico </option>
                      </Form.Select>
                    </Form.Group>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </MDBox>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

InfoCita.defaultProps = {
  show: false,
};

InfoCita.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  fetch: PropTypes.func,
  id_conmed: PropTypes.number,
};

export default InfoCita;
