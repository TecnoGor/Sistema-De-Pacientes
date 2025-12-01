import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import axios from "axios";

function CitaForm({ formDataCita, handleChange }) {
  const [medicos, setMedicos] = useState([]);
  const API_Host = process.env.REACT_APP_API_URL;

  // Cargar médicos al montar el componente
  return (
    <Form>
      <Row>
        {/* <Col>
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
        </Col> */}
        <Col>
          <Form.Group className="mb-3" controlId="cedula.ControlInput1">
            <Form.Label>Cedula de Paciente</Form.Label>
            <Form.Control
              type="number"
              placeholder="12345678"
              value={formDataCita.ci || ""}
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
              value={formDataCita.firstname || ""}
              name="firstname"
              onChange={handleChange}
              disabled
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              placeholder="Apellidos"
              value={formDataCita.lastname || ""}
              name="lastname"
              onChange={handleChange}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
            <Form.Label>Código de Consulta</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el Codigo de Consulta"
              value={formDataCita.codconsul || ""}
              name="codconsul"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
            <Form.Label>Fecha de Consulta</Form.Label>
            <Form.Control
              type="date"
              placeholder=""
              value={formDataCita.fechaConsul || ""}
              name="fechaConsul"
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
            <Form.Label>Motivo</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={formDataCita.motivo || ""}
              name="motivo"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
            <Form.Label>Diagnostico</Form.Label>
            <Form.Control
              type="text"
              placeholder="Describa el diagnostico"
              value={formDataCita.diagnostic || ""}
              name="diagnostic"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
            <Form.Label>Tratamiento</Form.Label>
            <Form.Control
              type="text"
              placeholder="Describa el tratamiento"
              value={formDataCita.tratment || ""}
              name="tratment"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="tipoCed.ControlSelect1">
            <Form.Label>Seleccione Médico</Form.Label>
            <Form.Select
              aria-label="Seleccionar médico"
              value={formDataCita.medicoid || ""}
              name="medicoid"
              onChange={handleChange}
              required
            >
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}

CitaForm.propTypes = {
  formDataCita: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default CitaForm;
