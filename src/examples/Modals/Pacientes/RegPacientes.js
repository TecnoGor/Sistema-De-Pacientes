import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PersonaForm from "examples/Cards/Forms/Persona";
import DatosPersonales from "examples/Cards/Forms/DatosPersonales";
import PacienteForm from "examples/Cards/Forms/Paciente";
import axios from "axios";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

function RegPacientes({ hClose, show }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [exceptionActive, setExceptionActive] = useState(false);
  const [personaExist, setPersonaExist] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [formDataPacientes, setFormDataPacientes] = useState({
    personaId: "",
    dpersonalesId: "",
    typeCi: "",
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
  const API_Host = process.env.REACT_APP_API_URL;

  const regPaciente = async () => {
    // console.log(formDataPacientes);
    try {
      const pacienteData = {
        personaId: formDataPacientes.personaId,
        dpersonalesId: formDataPacientes.dpersonalesId,
        typeCi: formDataPacientes.typeCi,
        ci: formDataPacientes.ci,
        firstname: formDataPacientes.firstname,
        lastname: formDataPacientes.lastname,
        mail: formDataPacientes.mail,
        phone: formDataPacientes.phone,
        bdate: formDataPacientes.bdate,
        scivil: formDataPacientes.scivil,
        studios: formDataPacientes.studios,
        ocupation: formDataPacientes.ocupation,
        state: formDataPacientes.state,
        municipio: formDataPacientes.municipio,
        parroquia: formDataPacientes.parroquia,
        dirhouse: formDataPacientes.dirhouse,
        typePaciente: formDataPacientes.typePaciente,
        referencia: formDataPacientes.referencia,
        carnetM: formDataPacientes.carnetM,
        gradoM: formDataPacientes.gradoM,
        componentM: formDataPacientes.componentM,
        carnetA: formDataPacientes.carnetA,
        exception: formDataPacientes.exception,
        exceptionD: formDataPacientes.exceptionD,
      };
      console.log(pacienteData);

      if (personaExist) {
        const responseDatosPersonales = await axios.post(
          `${API_Host}/api/regDatosPersonales`,
          pacienteData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (responseDatosPersonales.status === 201) {
          pacienteData.dpersonalesId = responseDatosPersonales.data.dpersonalesid;
          Swal.fire({
            title: "Datos personales Registrado!",
            text: "La persona ha sido registrado con éxito",
            icon: "success",
            draggable: true,
          });
        }
      } else {
        const responsePersona = await axios.post(`${API_Host}/api/regPersona`, pacienteData, {
          headers: { "Content-Type": "application/json" },
        });

        if (responsePersona.status === 201) {
          const consulPersona = await axios.get(`${API_Host}/api/selectPersona/${pacienteData.ci}`);
          // pacienteData({ personaId: consulPersona.data.id_persona });
          pacienteData.personaId = consulPersona.data.id_persona;
          const responseDatosPersonales = await axios.post(
            `${API_Host}/api/regDatosPersonales`,
            pacienteData,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          // Cambios Isotericos
          if (responseDatosPersonales.status === 201) {
            pacienteData.dpersonalesId = responseDatosPersonales.data.dpersonalesid;
            const responsePaciente = await axios.post(
              `${API_Host}/api/regDatosPersonales`,
              pacienteData,
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            if (responsePaciente.status === 201) {
              setFormDataPacientes({
                personaId: "",
                typeCi: "",
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
              });
              Swal.fire({
                title: "Datos personales Registrado!",
                text: "La persona ha sido registrado con éxito",
                icon: "success",
                draggable: true,
              });
              setCurrentStep(3);
            }
            //setCurrentStep(3);
          }
        }
      }
    } catch (error) {
      let errorMessage = "Error al registrar el paciente";

      if (error.response && error.response.data) {
        // Si la API devuelve un objeto de error con la cédula
        if (error.response.data.error) {
          errorMessage = `Error: ${error.response.data.error}`;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: "Error al registrar el paciente",
        text: errorMessage,
        icon: "error",
        draggable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataPacientes((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "ci" && value.length >= 6) {
      console.log(value);
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

  const consultaPersona = async (cedula) => {
    // console.log("rosita");
    if (cedula.length >= 6) {
      setCargando(true);
      try {
        const response = await axios.get(`${API_Host}/api/selectPersona/${cedula}`);

        if (response.data && response.data.id_persona) {
          setPersonaExist(true);
          formDataPacientes.personaId = response.data.id_persona;
          console.log(formDataPacientes.personaId);
          if (response.data.nombres) {
            setFormDataPacientes((prev) => ({
              ...prev,
              firstname: response.data.nombres,
              lastname: response.data.apellidos,
              typeCi: response.data.tipoci,
            }));
          }
          Swal.fire({
            title: "Persona encontrada!",
            text: "La persona ha sido registrado con anterioridad, debe registrar datos personales.",
            icon: "success",
            draggable: true,
          });
        } else {
          setPersonaExist(false);
        }
      } catch (error) {
        Swal.fire({
          title: "Error al consultar la persona",
          text: error,
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

  const handleNextDP = async () => {
    setCurrentStep(currentStep + 1);
  };

  const handleNextP = async () => {
    setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(currentStep - 2);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Modal size="lg" show={show} onHide={hClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentStep === 1 && (
          <PersonaForm formDataPersona={formDataPacientes} handleChange={handleChange} />
        )}
        {currentStep === 2 && (
          <DatosPersonales formDataPersonales={formDataPacientes} handleChange={handleChange} />
        )}
        {currentStep === 3 && (
          <PacienteForm
            formDataPaciente={formDataPacientes}
            handleChange={handleChange}
            exception={exceptionActive}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        {currentStep === 2 && (
          <>
            <Button variant="primary" onClick={handleNextDP}>
              Siguiente
            </Button>
            <Button variant="secondary" onClick={handleBack}>
              Atras
            </Button>
          </>
        )}
        {currentStep === 1 ? (
          <>
            {cargando && <CircularProgress />}
            {personaExist && !cargando && (
              <Button variant="primary" onClick={handleNextP}>
                <span style={{ color: "white" }}>✓ Persona encontrada</span>
              </Button>
            )}
            {!personaExist && formDataPacientes.ci.length >= 6 && !cargando && (
              <Button variant="primary" onClick={handleNextDP}>
                <span style={{ color: "white" }}>Siguiente</span>
              </Button>
            )}
          </>
        ) : (
          <Button variant="secondary" onClick={hClose}>
            Cerrar
          </Button>
        )}
        {currentStep === 3 ? (
          <>
            <Button variant="primary" onClick={regPaciente}>
              Registrar Paciente
            </Button>
            <Button variant="secondary" onClick={handleBack}>
              Atras
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={hClose}>
            Cerrar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

RegPacientes.defaultProps = {
  show: false,
};

RegPacientes.propTypes = {
  show: PropTypes.bool,
  hClose: PropTypes.func,
};

export default RegPacientes;
