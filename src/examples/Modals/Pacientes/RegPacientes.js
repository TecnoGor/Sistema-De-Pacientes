import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PersonaForm from "examples/Cards/Forms/Persona";
import DatosPersonales from "examples/Cards/Forms/DatosPersonales";
import axios from "axios";
import Swal from "sweetalert2";

function RegPacientes({ hClose, show }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formDataPacientes, setFormDataPacientes] = useState({
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
  const API_Host = process.env.REACT_APP_API_URL;

  const regPaciente = async () => {
    return console.log(formDataPacientes);
    try {
      const pacienteData = {
        personaId: formDataPacientes.personaId,
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
      };

      const responsePersona = await axios.post(`${API_Host}/api/regPersona`, pacienteData, {
        headers: { "Content-Type": "application/json" },
      });

      if (responsePersona.status === 201) {
        const consulPersona = await axios.get(`${API_Host}/api/selectPersona/${pacienteData.ci}`);
        setFormDataPacientes({ personaId: consulPersona.data.id_persona });
        const responsePaciente = await axios.post(`${API_Host}/api/insertPaciente`, pacienteData, {
          headers: { "Content-Type": "application/json" },
        });

        if (responsePersona.status === 201) {
          Swal.fire({
            title: "Paciente Registrado!",
            text: "El paciente ha sido registrado con éxito",
            icon: "success",
            draggable: true,
          })
        }
      }

    } catch {
      Swal.fire({
        title: "Error al registrar el paciente",
        text: `Error: ${error.response.data.message || "Error al registrar el paciente"}`,
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
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
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
      </Modal.Body>
      <Modal.Footer>
        {currentStep > 1 && (
          <>
            <Button variant="primary" onClick={regPaciente}>
              Registrar Paciente
            </Button>
            <Button variant="secondary" onClick={handleBack}>
              Atras
            </Button>
          </>
        )}
        {currentStep < 2 ? (
          <>
            <Button variant="primary" onClick={handleNext}>
              Siguiente
            </Button>
            <Button variant="secondary" onClick={hClose}>
              Cerrar
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
