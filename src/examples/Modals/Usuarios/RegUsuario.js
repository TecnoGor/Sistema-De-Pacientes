import React, { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const API_Host = process.env.REACT_APP_API_URL;

  // Validar formulario cada vez que cambien los datos
  useEffect(() => {
    validateForm();
  }, [formDataUsuarios]);

  const validateForm = () => {
    const newErrors = {};

    // Validar campos requeridos
    if (!formDataUsuarios.firstname?.trim()) {
      newErrors.firstname = "El nombre es requerido";
    } else if (formDataUsuarios.firstname.trim().length < 2) {
      newErrors.firstname = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formDataUsuarios.lastname?.trim()) {
      newErrors.lastname = "El apellido es requerido";
    } else if (formDataUsuarios.lastname.trim().length < 2) {
      newErrors.lastname = "El apellido debe tener al menos 2 caracteres";
    }

    if (!formDataUsuarios.ci?.trim()) {
      newErrors.ci = "La cédula es requerida";
    } else if (!/^\d+$/.test(formDataUsuarios.ci.trim())) {
      newErrors.ci = "La cédula debe contener solo números";
    } else if (formDataUsuarios.ci.trim().length < 6) {
      newErrors.ci = "La cédula debe tener al menos 6 dígitos";
    }

    if (!formDataUsuarios.nuser?.trim()) {
      newErrors.nuser = "El nombre de usuario es requerido";
    } else if (formDataUsuarios.nuser.trim().length < 3) {
      newErrors.nuser = "El usuario debe tener al menos 3 caracteres";
    }

    if (!formDataUsuarios.password?.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formDataUsuarios.password.trim().length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formDataUsuarios.rol) {
      newErrors.rol = "Debe seleccionar un rol";
    }

    setErrors(newErrors);

    // El formulario es válido si no hay errores y todos los campos requeridos están llenos
    const isValid =
      Object.keys(newErrors).length === 0 &&
      formDataUsuarios.firstname?.trim() &&
      formDataUsuarios.lastname?.trim() &&
      formDataUsuarios.ci?.trim() &&
      formDataUsuarios.nuser?.trim() &&
      formDataUsuarios.password?.trim() &&
      formDataUsuarios.rol;

    setIsFormValid(isValid);
  };

  const regUsuario = async () => {
    // Validar antes de enviar
    if (!isFormValid) {
      Swal.fire({
        title: "Formulario incompleto",
        text: "Por favor complete todos los campos requeridos correctamente",
        icon: "warning",
        draggable: true,
      });
      return;
    }

    if (personaExist) {
    } else {
      setCargando(true);

      try {
        console.log(formDataUsuarios);
        const result = await axios.post(`${API_Host}/api/regPersona`, formDataUsuarios, {
          headers: { "Content-Type": "application/json" },
        });

        if (result.status === 201) {
          const id_persona = result.data.id_persona;
          if (!id_persona) {
            throw new Error("No se recibió el id de la persona en el registro");
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
            setErrors({});
            fetch();
            Swal.fire({
              title: "Usuario Registrado!",
              text: "Usuario registrado con éxito.",
              icon: "success",
              draggable: true,
            });
          }
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.code === "23505") {
          Swal.fire({
            title: "Error al realizar el registro.",
            text: "La persona ya se encuentra registrada.",
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
    }
  };

  const consultaPersona = async (cedula) => {
    if (cedula.length >= 6) {
      setCargando(true);
      try {
        const response = await axios.get(`${API_Host}/api/selectPersona/${cedula}`);

        if (response.data && response.data.id_persona) {
          setPersonaExist(true);

          // CORRECCIÓN: Manejo correcto de valores nulos
          const dpId =
            response.data.id_dpersonales !== null ? parseInt(response.data.id_dpersonales) : null;

          setFormDataUsuarios((prev) => ({
            ...prev,
            id_persona: response.data.id_persona,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataUsuarios((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "exceptionCheck") {
      setExceptionActive(e.target.checked);
    }
    if (name === "ci" && value.length >= 6) {
      // console.log(value);
      consultaPersona(value);
    }
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <Modal size="lg" show={show} onHide={close} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UsuarioForm
          formDataUsuario={formDataUsuarios}
          handleChange={handleChange}
          errors={errors}
        />
      </Modal.Body>
      <Modal.Footer>
        {cargando ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <Button variant="primary" onClick={regUsuario} disabled={!isFormValid || cargando}>
              Registrar Usuario
            </Button>
            <Button variant="secondary" onClick={close} disabled={cargando}>
              Cerrar
            </Button>
          </>
        )}
      </Modal.Footer>
      {!isFormValid && Object.keys(errors).length > 0 && (
        <div className="alert alert-warning m-3">
          <strong>Por favor corrija los siguientes errores:</strong>
          <ul className="mb-0 mt-1">
            {Object.entries(errors).map(([field, error]) => error && <li key={field}>{error}</li>)}
          </ul>
        </div>
      )}
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
