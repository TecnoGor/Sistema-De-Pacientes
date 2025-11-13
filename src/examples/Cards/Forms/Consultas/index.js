import React from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function ConsultaForm({ formDataConsulta, handleChange }) {
  return (
    <Form>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="tipoCed.ControlSelect1">
            <Form.Label>Tipo de Cedula</Form.Label>
            <Form.Select
              aria-label="Default example"
              value={formDataConsulta.typeCi || ""}
              name="typeCi"
              onChange={handleChange}
            >
              <option>Seleccione...</option>
              <option value="V">V</option>
              <option value="E">E</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="cedula.ControlInput1">
            <Form.Label>Cedula</Form.Label>
            <Form.Control
              type="number"
              placeholder="12345678"
              value={formDataConsulta.ci || ""}
              name="ci"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="nombres.ControlInput2">
            <Form.Label>Nombres</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombres"
              value={formDataConsulta.firstname || ""}
              name="firstname"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              placeholder="Apellidos"
              value={formDataConsulta.lastname || ""}
              name="lastname"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}

ConsultaForm.propTypes = {
  formDataConsulta: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ConsultaForm;
