import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RepresentanteForm from "examples/Cards/Forms/Representante";

function RegRepresentante({ hClose, show }) {
  // const [currentStep, setCurrentStep] = useState(1);

  return (
    <Modal size="lg" show={show} onHide={hClose} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Representante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RepresentanteForm />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary">Guardar Representante</Button>
        <Button variant="secondary" onClick={hClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

RegRepresentante.defaultProps = {
  show: false,
};

RegRepresentante.propTypes = {
  show: PropTypes.bool,
  hClose: PropTypes.func,
};

export default RegRepresentante;
