import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ConsultaForm from "examples/Cards/Forms/Consultas";
import axios from "axios";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

function RegConsultas({ close, show, fetch }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [exceptionActive, setExceptionActive] = useState(false);
  const [personaExist, setPersonaExist] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [formDataConsultas, setFormDataConsultas] = useState({
    personaId: null,
    dpersonalesId: null,
    typeCi: "",
    ci: "",
    firstname: "",
    lastname: "",
    mail: "",
    phone: "",
    bdate: "",
    scivil: "",
  });
  const API_Host = process.env.REACT_APP_API_URL;

  const regConsultas = async () => {
    console.log("registrando consulta");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataPacientes((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "ci" && value.length >= 6) {
      // console.log(value);
      consultaPersona(value);
    }
    if (name === "exceptionCheck") {
      setExceptionActive(e.target.checked);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Tipo de archivo no permitido. Use PDF, JPG o PNG.");
        e.target.value = "";
        return;
      }
      // Validar tamaño (ejemplo: 5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 5MB.");
        e.target.value = "";
        return;
      }
      setArchivo(file);
    }
  };

  const consultaPaciente = async (cedula) => {
    if (cedula.length >= 6) {
      setCargando(true);
      try {
        const response = await axios.get(`${API_Host}/api/selectPersona/${cedula}`);

        if (response.data && response.data.id_persona) {
          setPersonaExist(true);

          // CORRECCIÓN: Manejo correcto de valores nulos
          const dpId =
            response.data.id_dpersonales !== null ? parseInt(response.data.id_dpersonales) : null;

          setFormDataPacientes((prev) => ({
            ...prev,
            personaId: response.data.id_persona,
            dpersonalesId: dpId,
            firstname: response.data.nombres,
            lastname: response.data.apellidos,
            typeCi: response.data.tipoci,
            ci: response.data.cedula,
          }));

          if (dpId) {
            Swal.fire({
              title: "Persona encontrada!",
              text: "La persona ha sido registrado con anterioridad.",
              icon: "success",
              draggable: true,
            });
          } else {
            Swal.fire({
              title: "Persona encontrada!",
              text: "La persona ha sido registrado con anterioridad. Debe registrar los datos Personales",
              icon: "success",
              draggable: true,
            });
          }
        } else {
          setPersonaExist(false);
        }
      } catch (error) {
        Swal.fire({
          title: "Error al consultar la persona",
          text: error.message,
          icon: "error",
          draggable: true,
        });
        setPersonaExist(false);
      } finally {
        setCargando(false);
      }
    } else {
      setPersonaExist(false);
    }
  };

  return (
    <Modal size="lg" show={show} onHide={close} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ConsultaForm formDataConsulta={formDataPacientes} handleChange={handleChange} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={regPaciente}>
            Registrar Paciente
        </Button>
        <Button variant="secondary" onClick={handleBack}>
            Atras
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

RegConsultas.defaultProps = {
  show: false,
};

RegConsultas.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  fetch: PropTypes.func,
};

export default RegConsultas;
