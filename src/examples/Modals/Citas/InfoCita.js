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
import NotInterestedIcon from "@mui/icons-material/NotInterested";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Swal from "sweetalert2";
import InfoAvances from "./InfoAvances";
import { CircularProgress } from "@mui/material";

function InfoCita({ show, close, fetch, id_conmed }) {
  const id = id_conmed;
  const [showInfo, setShowInfo] = useState(false);
  const [getIdConmed, setGetIdConmed] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdvance, setIsAdvance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [getId, setGetId] = useState(null);
  const API_Host = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    id_conmed: "",
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
    diagnostico_avance: "",
    tiempo_tratamiento: "",
    fecha_avance: "",
    estado_paciente: "",
    status_consulta: false,
    protocolo: "",
    tiempo_protocolo: "",
    parterial_before: "",
    estatura_before: "",
    peso_before: "",
    saturacion_before: "",
    pulso_before: "",
    frespiratoria_before: "",
    parterial_after: "",
    estatura_after: "",
    peso_after: "",
    saturacion_after: "",
    pulso_after: "",
    frespiratoria_after: "",
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

  const handleDisabled = async () => {
    console.log("Desabilitando cita: ", formData.codconsul);

    if (formData.status_consulta) {
      try {
        const responseUpdate = await axios.post(`${API_Host}/api/updateConsulta`, formData, {
          headers: { "Content-Type": "application/json" },
        });
        if (responseUpdate.status === 201) {
          Swal.fire({
            title: "Consulta Inhabilitada!",
            text: "Consulta inhabilitada con exito.",
            icon: "info",
            draggable: true,
          });
          fetch();
        }
      } catch (error) {
        Swal.fire({
          title: "Error al inhabilitar la consulta.",
          text: error.message,
          icon: "error",
          draggable: true,
        });
      }
    }
  };

  const handleSave = async () => {
    // Aquí puedes agregar la lógica para guardar los cambios
    console.log("Guardando cambios...", formData);
    try {
      const result = await axios.post(`${API_Host}/api/regSesion`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (result.status === 201) {
        Swal.fire({
          title: "Sesión Registrada!",
          text: "Cita Agendada con exito.",
          icon: "success",
          draggable: true,
        });
        fetch();
        setIsAdvance(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Error al realizar el avance.",
        text: error.message,
        icon: "error",
        draggable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        id_conmed: id,
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
        status_consulta: citaData.status,
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
              <>
                {!formData.status_consulta ? (
                  <>
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={toggleAdvance}
                      startIcon={<Icon>edit</Icon>}
                      disabled
                    >
                      Registrar Avance
                    </MDButton>
                    &nbsp;
                  </>
                ) : (
                  <>
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={toggleAdvance}
                      startIcon={<Icon>dataset</Icon>}
                    >
                      Registrar Sesion
                    </MDButton>
                    &nbsp;&nbsp;
                    <MDButton
                      variant="gradient"
                      color="error"
                      onClick={handleDisabled}
                      startIcon={<NotInterestedIcon />}
                    >
                      Finalizar Consulta
                    </MDButton>
                  </>
                )}
              </>
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
                  Registrar Sesion
                </MDTypography>

                <Grid container spacing={3}>
                  {/* Estudios */}
                  <Grid item xs={12} sm={4}>
                    <Form.Group className="mb-3" controlId="estadoPaciente.ControlSelect1">
                      <Form.Label style={{ fontSize: "1rem" }}>Protocolo ATA</Form.Label>
                      <Form.Select
                        aria-label="Seleccionar protocolo"
                        value={formData.protocolo}
                        onChange={handleChange}
                        name="protocolo"
                        required
                      >
                        <option value="" disabled>
                          Seleccione...
                        </option>
                        <option value="1,5 ATA's"> 1,5 ATA </option>
                        <option value="1,7 ATA's"> 1,7 ATA </option>
                        <option value="2 ATA's"> 2 ATA </option>
                      </Form.Select>
                    </Form.Group>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Form.Group className="mb-3" controlId="estadoPaciente.ControlSelect1">
                      <Form.Label style={{ fontSize: "1rem" }}>Tiempo de Tratamiento</Form.Label>
                      <Form.Select
                        aria-label="Seleccionar protocolo"
                        value={formData.tiempo_protocolo}
                        onChange={handleChange}
                        name="tiempo_protocolo"
                        required
                      >
                        <option value="" disabled>
                          Seleccione...
                        </option>
                        <option value="45 min"> 45 min </option>
                        <option value="60 min"> 60 min </option>
                        <option value="90 min"> 90 min </option>
                        <option value="120 min"> 120 min </option>
                      </Form.Select>
                    </Form.Group>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDTypography style={{ fontSize: "1rem" }}>Proxima Cita</MDTypography>
                    <MDInput
                      label="Proxima Cita"
                      name="fecha_avance"
                      type="date"
                      value={formData.fecha_avance}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MDTypography variant="h6" gutterBottom color="primary">
                      Signos Vitales Antes de la Sesion
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Presion Arterial"
                      name="parterial_before"
                      type="text"
                      onChange={handleChange}
                      value={formData.parterial_before}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Estatura Cm"
                      name="estatura_before"
                      type="number"
                      value={formData.estatura_before}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Peso Kg"
                      name="peso_before"
                      type="number"
                      value={formData.peso_before}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Saturacion de Oxigeno"
                      name="saturacion_before"
                      type="number"
                      onChange={handleChange}
                      value={formData.saturacion_before}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Pulso / min"
                      name="pulso_before"
                      type="text"
                      value={formData.pulso_before}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Frecuencia Respiratoria"
                      name="frespiratoria_before"
                      type="text"
                      value={formData.frespiratoria_before}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MDTypography variant="h6" gutterBottom color="primary">
                      Signos Vitales Después de la Sesión
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Presion Arterial"
                      name="parterial_after"
                      type="text"
                      onChange={handleChange}
                      value={formData.parterial_after}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Estatura Cm"
                      name="estatura_after"
                      type="number"
                      value={formData.estatura_after}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Peso Kg"
                      name="peso_after"
                      type="number"
                      value={formData.peso_after}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Saturacion de Oxigeno"
                      name="saturacion_after"
                      type="number"
                      onChange={handleChange}
                      value={formData.saturacion_after}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Pulso / min"
                      name="pulso_after"
                      type="text"
                      value={formData.pulso_after}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MDInput
                      label="Frecuencia Respiratoria"
                      name="frespiratoria_after"
                      type="text"
                      value={formData.frespiratoria_after}
                      onChange={handleChange}
                      fullWidth
                    />
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
