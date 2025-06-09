import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import PersonalMedico from "examples/Cards/Forms/PersonalMedico";

function RegPersonalMedico({ hClose, show }) {
  const [tipoPersonal, setTipoPersonal] = useState("");

  const handleTipoChange = (e) => {
    setTipoPersonal(e.target.value);
  };

  return (
    <Modal size="lg" show={show} onHide={hClose} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Personal Medico</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="tipoPersonal">
          <Form.Label>Tipo de Personal</Form.Label>
          <Form.Select value={tipoPersonal} onChange={handleTipoChange} required>
            <option value="">Seleccione...</option>
            <option value="1">Medico</option>
            <option value="2">Tecnico</option>
            <option value="3">Enfermero</option>
          </Form.Select>
        </Form.Group>
        {tipoPersonal && <PersonalMedico personal={parseInt(tipoPersonal)} />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" disabled={!tipoPersonal}>
          Guardar Personal
        </Button>
        <Button variant="secondary" onClick={hClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

RegPersonalMedico.defaultProps = {
  show: false,
};

RegPersonalMedico.propTypes = {
  show: PropTypes.bool,
  hClose: PropTypes.func,
};

export default RegPersonalMedico;
