import React from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function PacienteForm({ formDataPaciente, handleChange }) {
  return (
    <Form>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="typePaciente.ControlSelect1">
            <Form.Label>Tipo de Paciente</Form.Label>
            <Form.Select
              aria-label="Default example"
              value={formDataPaciente.typePaciente || ""}
              name="typePaciente"
              onChange={handleChange}
            >
              <option>Seleccione...</option>
              <option value="Militar">Militar</option>
              <option value="Afiliado">Afiliado</option>
              <option value="No Afiliado">No Afiliado</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="referencia.ControlInput1">
            <Form.Label>Referencia</Form.Label>
            <Form.Control
              type="text"
              placeholder="Referencia Medica"
              value={formDataPaciente.referencia || ""}
              name="referencia"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          {formDataPaciente.typePaciente === "Militar" && (
            <Form.Group className="mb-3" controlId="carnetM.ControlInput2">
              <Form.Label>N° Carnet Militar</Form.Label>
              <Form.Control
                type="text"
                placeholder="Carnet Militar"
                value={formDataPaciente.carnetM || ""}
                name="carnetM"
                onChange={handleChange}
              />
            </Form.Group>
          )}
        </Col>
      </Row>
    </Form>
  );
}

PacienteForm.propTypes = {
  formDataPaciente: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default PacienteForm;
