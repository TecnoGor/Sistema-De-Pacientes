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
  const [personaExist, setPersonaExist] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [formDataConsultas, setFormDataConsultas] = useState({
    pacienteId: "",
    ci: "",
    firstname: "",
    lastname: "",
    codconsul: "",
    fechaConsul: "",
    motivo: "",
    diagnostic: "",
    tratment: "",
    medicoid: "",
  });
  const API_Host = process.env.REACT_APP_API_URL;

  const regConsultas = async () => {
    try {
      console.log(formDataConsultas);
      const result = await axios.post(`${API_Host}/api/regConsultas`, formDataConsultas, {
        headers: { "Content-Type": "application/json" },
      });

      if (result.status === 201) {
        Swal.fire({
          title: "Consulta Registrada!",
          text: "Consulta Agendada con exito.",
          icon: "success",
          draggable: true,
        });
      }
      fetch();
    } catch (err) {
      // console.log("registrando consulta");
      Swal.fire({
        title: "Error al realizar la consulta.",
        text: err.message,
        icon: "error",
        draggable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataConsultas((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "ci" && value.length >= 6) {
      // console.log(value);
      consultaPaciente(value);
    }
    if (name === "exceptionCheck") {
      setExceptionActive(e.target.checked);
    }
  };

  const consultaPaciente = async (cedula) => {
    if (cedula.length >= 6) {
      setCargando(true);
      try {
        const response = await axios.get(`${API_Host}/api/pacienteII/${cedula}`);
        console.log(response.data.id_persona);

        if (response.data && Object.keys(response.data).length > 0) {
          setPersonaExist(true);

          // CORRECCIÓN: Manejo correcto de valores nulos
          // const dpId =
          //   response.data.id_dpersonales !== null ? parseInt(response.data.id_dpersonales) : null;

          setFormDataConsultas((prev) => ({
            ...prev,
            pacienteId: response.data.id_paciente,
            firstname: response.data.nombres,
            lastname: response.data.apellidos,
          }));
          Swal.fire({
            title: "Paciente encontrada!",
            text: "Paciente encontrado con exito",
            icon: "success",
            draggable: true,
          });

          // if (dpId) {
          //   Swal.fire({
          //     title: "Persona encontrada!",
          //     text: "La persona ha sido registrado con anterioridad.",
          //     icon: "success",
          //     draggable: true,
          //   });
          // } else {
          //   Swal.fire({
          //     title: "Persona encontrada!",
          //     text: "La persona ha sido registrado con anterioridad. Debe registrar los datos Personales",
          //     icon: "success",
          //     draggable: true,
          //   });
          // }
        } else {
          setPersonaExist(false);
        }
      } catch (error) {
        // Swal.fire({
        //   title: "Error al consultar la persona",
        //   text: error.message,
        //   icon: "error",
        //   draggable: true,
        // });
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
        <Modal.Title>Registrar - Programar Consulta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ConsultaForm formDataConsulta={formDataConsultas} handleChange={handleChange} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={regConsultas}>
          Registrar Consulta
        </Button>
        <Button variant="secondary" onClick={close}>
          Cerrar
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
