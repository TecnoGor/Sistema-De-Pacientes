import React from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function PacienteForm({ formDataPaciente, handleChange, exception, handleFileChange }) {
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
        {formDataPaciente.typePaciente === "Militar" && (
          <Row>
            <Col>
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
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="gradoM.ControlInput3">
                <Form.Label>Grado Militar</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Grado Militar"
                  value={formDataPaciente.gradoM || ""}
                  name="gradoM"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="componentM.ControlInput4">
                <Form.Label>Componente Militar</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Componente Militar"
                  value={formDataPaciente.componentM || ""}
                  name="componentM"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
        {formDataPaciente.typePaciente === "Afiliado" && (
          <Col>
            <Form.Group className="mb-3" controlId="carnetA.ControlInput5">
              <Form.Label>N° Carnet Afiliado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Carnet Afiliado"
                value={formDataPaciente.carnetA || ""}
                name="carnetA"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        )}
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="exceptionCheck.ControlInput6">
            {/* <Form.Label>Excepcion</Form.Label> */}
            <Form.Check
              type="checkbox"
              label="Excepción"
              checked={exception}
              name="exceptionCheck"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        {exception ? (
          <Col>
            <Form.Group className="mb-3" controlId="exceptionD.ControlInput7">
              <Form.Label>Detallles de exception</Form.Label>
              <Form.Control
                type="text"
                placeholder="Detalles de la Excepcion"
                value={formDataPaciente.exceptionD || ""}
                name="exceptionD"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        ) : (
          <Col>
            <Form.Group className="mb-3" controlId="referencia.ControlInput8">
              <Form.Label>Referencia Medica</Form.Label>
              <Form.Control
                type="file"
                value={formDataPaciente.referencia || ""}
                accept=".pdf, .png, .jpg, .jpeg"
                name="referencia"
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">Formatos Aceptados: PDF, JPG, JPEG, PNG.</Form.Text>
            </Form.Group>
          </Col>
        )}
      </Row>
    </Form>
  );
}

PacienteForm.propTypes = {
  formDataPaciente: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  exception: PropTypes.bool.isRequired,
};

export default PacienteForm;
