import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";

function RepresentanteForm() {
  const [formData, setFormData] = useState({
    parentezco: "",
    nombre: "",
    apellido: "",
    tipoCedula: "",
    cedula: "",
    fechaNac: "",
    profesion: "",
    email: "",
    telefono: "",
    edoCivil: "",
    nivInst: "",
    estado: "",
    municipio: "",
    parroquia: "",
    direccion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  return (
    <Form>
      {/* DATOS PERSONA */}
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="parentezco">
            <Form.Label>Parentezco</Form.Label>
            <Form.Select
              name="parentezco"
              value={formData.parentezco}
              onChange={handleChange}
              aria-label="Default example"
            >
              <option>Seleccione...</option>
              <option value="Abuelo/a">Abuelo/a</option>
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Tio/a">Tio/a</option>
              <option value="Hermano/a">Hermano/a</option>
              <option value="Representante">Representante Legal</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="tipoCedula">
            <Form.Label>Tipo de Cedula</Form.Label>
            <Form.Select
              name="tipoCedula"
              value={formData.tipoCedula}
              onChange={handleChange}
              aria-label="Default example"
            >
              <option>Seleccione...</option>
              <option value="V">V</option>
              <option value="E">E</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="cedula">
            <Form.Label>Cedula</Form.Label>
            <Form.Control
              type="number"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="12345678"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="nombres">
            <Form.Label>Nombres</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombres"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="apellidos">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellidos"
            />
          </Form.Group>
        </Col>
      </Row>
      {/* DATOS PERSONALES */}
      <Row>
        <Col>
          <FloatingLabel controlId="email" label="Correo Electronico" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jhon@email.com"
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel controlId="telefono" label="Telefono Celular / Local" className="mb-3">
            <Form.Control
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+58-416-123-4567"
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col>
          <FloatingLabel controlId="fechaNac" label="Fecha de nacimiento" className="mb-3">
            <Form.Control
              type="date"
              name="fechaNac"
              value={formData.fechaNac}
              onChange={handleChange}
              placeholder="01/01/2005"
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel controlId="edoCivil" label="Estado Civil" className="mb-3">
            <Form.Select name="edoCivil" value={formData.edoCivil} onChange={handleChange}>
              <option value="">Seleccione...</option>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Concubino">Concubino</option>
              <option value="Viudo">Viudo</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel controlId="nivInst" label="Grado de Instruccion" className="mb-3">
            <Form.Select name="nivInst" value={formData.nivInst} onChange={handleChange}>
              <option value="">Seleccione...</option>
              <option value="Sin Estudios">Sin Estudios</option>
              <option value="Kinder">Kinder</option>
              <option value="Primaria">Primaria</option>
              <option value="Bachiller">Bachiller</option>
              <option value="TSU">TSU</option>
              <option value="Universitario">Universitario</option>
              <option value="Maestria">Maestria</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
      </Row>

      {/* Campo de profesión/ocupación (solo visible para mayores de edad) */}
      <Row>
        <Col>
          <FloatingLabel controlId="profesion" label="Profesion/Ocupacion" className="mb-3">
            <Form.Control
              as="textarea"
              name="profesion"
              value={formData.profesion}
              onChange={handleChange}
              placeholder="A que se dedica o que profesion ocupa"
              style={{ height: "100px" }}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col>
          <FloatingLabel controlId="estado" label="Estado" className="mb-3">
            <Form.Select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="">Seleccione...</option>
              <option value="Distrito Capital">Distrito Capital</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel controlId="municipio" label="Municipios" className="mb-3">
            <Form.Select name="municipio" value={formData.municipio} onChange={handleChange}>
              <option value="">Seleccione...</option>
              <option value="Libertador">Libertador</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel controlId="parroquia" label="Parroquia" className="mb-3">
            <Form.Select name="parroquia" value={formData.parroquia} onChange={handleChange}>
              <option value="">Seleccione...</option>
              <option value="San Juan">San Juan</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col>
          <FloatingLabel controlId="direccion" label="Direccion de Habitacion" className="mb-3">
            <Form.Control
              as="textarea"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Direccion de habitacion donde reside"
              style={{ height: "100px" }}
            />
          </FloatingLabel>
        </Col>
      </Row>
    </Form>
  );
}

export default RepresentanteForm;
