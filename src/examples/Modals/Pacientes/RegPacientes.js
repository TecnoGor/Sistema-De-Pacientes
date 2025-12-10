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

function RegPacientes({ hClose, show, fetch }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [exceptionActive, setExceptionActive] = useState(false);
  const [personaExist, setPersonaExist] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [formDataPacientes, setFormDataPacientes] = useState({
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
    try {
      // Crear un objeto limpio sin valores problemáticos
      const cleanData = { ...formDataPacientes };

      // Limpiar el objeto de valores nulos/undefined
      Object.keys(cleanData).forEach((key) => {
        if (cleanData[key] === null || cleanData[key] === undefined || cleanData[key] === "") {
          delete cleanData[key];
        }
      });

      const formData = new FormData();

      // Agregar campos uno por uno de manera controlada
      const fieldsToInclude = [
        "personaId",
        "typeCi",
        "ci",
        "firstname",
        "lastname",
        "mail",
        "phone",
        "bdate",
        "scivil",
        "studios",
        "ocupation",
        "state",
        "municipio",
        "parroquia",
        "dirhouse",
        "typePaciente",
        "carnetM",
        "gradoM",
        "componentM",
        "carnetA",
        "exceptionD",
      ];

      fieldsToInclude.forEach((field) => {
        if (cleanData[field] !== undefined) {
          formData.append(field, cleanData[field].toString());
        }
      });

      // Manejar archivo
      if (archivo) {
        formData.append("referencia", archivo);
      } else if (exceptionActive) {
        formData.append("referencia", "excepcion");
      } else {
        formData.append("referencia", "");
      }

      formData.append("excepcion", exceptionActive.toString());

      // DEBUG: Verificar qué se está enviando
      console.log("=== DATOS A ENVIAR ===");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      if (personaExist) {
        const hasDP =
          formDataPacientes.dpersonalesId &&
          formDataPacientes.dpersonalesId !== "null" &&
          formDataPacientes.dpersonalesId !== null;

        if (hasDP) {
          // Persona existe y tiene datos personales
          console.log(
            "Caso 1: Persona existe con DP, dpersonalesId:",
            formDataPacientes.dpersonalesId
          );

          // Convertir a número de manera segura
          const dpId = parseInt(formDataPacientes.dpersonalesId);
          if (!isNaN(dpId)) {
            formData.append("dpersonalesId", dpId.toString());
            await regPacienteCompleto(formData);
          } else {
            throw new Error("ID de datos personales inválido: " + formDataPacientes.dpersonalesId);
          }
        } else {
          // Persona existe pero NO tiene datos personales
          console.log("Caso 2: Persona existe sin DP");

          // Registrar datos personales primero
          const dpResponse = await axios.post(`${API_Host}/api/regDatosPersonales`, formData, {
            headers: { "Content-Type": "application/json" },
          });
          if (dpResponse.status === 201) {
            const newDPId = dpResponse.data.dpersonalesid;
            console.log("Nuevo DP ID:", newDPId);

            if (newDPId) {
              // Crear nuevo FormData para paciente
              const pacienteFormData = new FormData();

              // Copiar todos los campos del formData original
              for (let [key, value] of formData.entries()) {
                pacienteFormData.append(key, value);
              }

              // Agregar el nuevo ID de datos personales
              pacienteFormData.append("dpersonalesId", parseInt(newDPId).toString());

              console.log("=== DATOS PARA PACIENTE ===");
              for (let [key, value] of pacienteFormData.entries()) {
                console.log(`${key}: ${value}`);
              }

              await regPacienteCompleto(pacienteFormData);
            }
          }
        }
      } else {
        // Persona NO existe - Registrar todo desde cero
        console.log("Caso 3: Persona no existe");

        // 1. Registrar persona
        const personaResponse = await axios.post(`${API_Host}/api/regPersona`, formData, {
          headers: { "Content-Type": "application/json" },
        });

        if (personaResponse.status === 201) {
          // 2. Obtener ID de la persona recién creada
          const personaData = await axios.get(
            `${API_Host}/api/selectPersona/${formDataPacientes.ci}`
          );

          const personaId = personaData.data.id_persona;
          console.log("Nueva Persona ID:", personaId);
          // 3. Registrar datos personales
          const dpFormData = new FormData();
          for (let [key, value] of formData.entries()) {
            dpFormData.append(key, value);
          }
          dpFormData.append("personaId", personaId.toString());

          const dpResponse = await axios.post(`${API_Host}/api/regDatosPersonales`, dpFormData, {
            headers: { "Content-Type": "application/json" },
          });

          if (dpResponse.status === 201) {
            const newDPId = dpResponse.data.dpersonalesid;
            console.log("Nuevo DP ID:", newDPId);

            // 4. Registrar paciente completo
            const pacienteFormData = new FormData();
            for (let [key, value] of formData.entries()) {
              if (key !== "dpersonalesId") {
                pacienteFormData.append(key, value);
              }
            }
            pacienteFormData.append("personaId", personaId.toString());
            pacienteFormData.append("dpersonalesId", parseInt(newDPId).toString());

            console.log("=== DATOS FINALES PARA PACIENTE ===");
            for (let [key, value] of pacienteFormData.entries()) {
              console.log(`${key}: ${value}`);
            }

            await regPacienteCompleto(pacienteFormData);
          }
        }
      }
    } catch (error) {
      console.error("Error completo:", error);
      let errorMessage = "Error al registrar el paciente";

      if (error.response && error.response.data) {
        console.error("Error response:", error.response.data);
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

  const regPacienteCompleto = async (a) => {
    // console.log("A:", a);
    try {
      const responsePaciente = await axios.post(`${API_Host}/api/regPacientes`, a, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (responsePaciente.status === 201) {
        setFormDataPacientes({
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
        setArchivo(null);
        setExceptionActive(false);
        setCurrentStep(1);

        Swal.fire({
          title: "!Paciente Registrado!",
          text: "El paciente ha sido registrado con exito",
          icon: "success",
          draggable: true,
        }).then(() => {
          hClose();
          fetch();
        });
      }
    } catch (error) {
      throw error;
    }
  };

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
    <Modal size="lg" show={show} onHide={hClose} backdrop="static" keyboard={false} centered>
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
            handleFileChange={handleFileChange}
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
            {personaExist &&
              !cargando &&
              formDataPacientes.dpersonalesId &&
              formDataPacientes.dpersonalesId > 0 && (
                <Button variant="primary" onClick={handleNextP}>
                  <span style={{ color: "white" }}>✓ Persona encontrada</span>
                </Button>
              )}
            {personaExist &&
              (!formDataPacientes.dpersonalesId || formDataPacientes.dpersonalesId === null) &&
              !cargando && (
                <Button variant="primary" onClick={handleNextDP}>
                  <span style={{ color: "white" }}>Siguiente</span>
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
  fetch: PropTypes.func,
};

export default RegPacientes;
