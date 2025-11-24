import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UsuarioForm from "examples/Cards/Forms/Usuarios";
import axios from "axios";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

function RegUsuarios({ close, show, fetch }) {
  const [personaExist, setPersonaExist] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [formDataUsuarios, setFormDataUsuarios] = useState({
    id_usuario: "",
    nuser: "",
    firstname: "",
    lastname: "",
    typeCi: "V",
    ci: "",
    rol: null,
    password: "",
    status: 1,
    id_persona: "",
  });
  const API_Host = process.env.REACT_APP_API_URL;

  const regUsuario = async () => {
    try {
      console.log(formDataUsuarios);
      const result = await axios.post(`${API_Host}/api/regPersona`, formDataUsuarios, {
        headers: { "Content-Type": "application/json" },
      });

      if (result.status === 201) {
        const id_persona = result.data.id_persona;
        if (!id_persona) {
          throw new Error("No se recibio el id dwe la persona en el registro");
        }
        const dataUsuario = {
          id_persona: id_persona,
          username: formDataUsuarios.nuser,
          password: formDataUsuarios.password,
          status: formDataUsuarios.status,
          rol: formDataUsuarios.rol,
        };

        const responseUsuario = await axios.post(`${API_Host}/api/regUser`, dataUsuario, {
          timeout: 5000,
        });

        if (responseUsuario.status === 201) {
          setFormDataUsuarios({
            firstname: "",
            lastname: "",
            ci: "",
            mail: "",
            phone: "",
            nuser: "",
            password: "",
            status: 1,
            rol: 2,
          });
          fetch();
          Swal.fire({
            title: "Usuario Registrado!",
            text: "Usuario registrado con exito.",
            icon: "success",
            draggable: true,
          });
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.code === "23505") {
        Swal.fire({
          title: "Error al realizar el registro.",
          text: " La persona ya se encuentra registrada.",
          icon: "error",
          draggable: true,
        });
      } else if (err.response && err.response.data) {
        // Otros errores del servidor
        Swal.fire({
          title: "Error al realizar el registro",
          text: err.response.data.message || err.message,
          icon: "error",
          draggable: true,
        });
      } else {
        // Errores de conexión u otros
        Swal.fire({
          title: "Error de conexión",
          text: err.message,
          icon: "error",
          draggable: true,
        });
      }
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataUsuarios((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "exceptionCheck") {
      setExceptionActive(e.target.checked);
    }
  };

  return (
    <Modal size="lg" show={show} onHide={close} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar - Programar Consulta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UsuarioForm formDataUsuario={formDataUsuarios} handleChange={handleChange} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={regUsuario}>
          Registrar Usuario
        </Button>
        <Button variant="secondary" onClick={close}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

RegUsuarios.defaultProps = {
  show: false,
};

RegUsuarios.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  fetch: PropTypes.func,
};

export default RegUsuarios;
