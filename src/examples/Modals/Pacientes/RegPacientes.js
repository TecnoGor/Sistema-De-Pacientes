import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PersonaForm from "examples/Cards/Forms/Persona";
import DatosPersonales from "examples/Cards/Forms/DatosPersonales";

function RegPacientes({ hClose, show }) {
  const [currentStep, setCurrentStep] = useState(1);

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
        {currentStep === 1 && <PersonaForm />}
        {currentStep === 2 && <DatosPersonales />}
      </Modal.Body>
      <Modal.Footer>
        {currentStep > 1 && (
          <Button variant="secondary" onClick={handleBack}>
            Atras
          </Button>
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
