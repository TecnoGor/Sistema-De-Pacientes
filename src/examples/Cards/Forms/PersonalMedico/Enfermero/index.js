import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";

function EnfermeroForm() {
  const [formData, setFormData] = useState({
    parentezco: "",
    nombre: "",
    apellido: "",
    tipoCedula: "",
    cedula: "",
    fechaNac: "",
    enfCode: "",
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
          <FloatingLabel controlId="tipoCedula" label="Tipo de Cedula" className="mb-3">
            <Form.Select name="tipoCedula" value={formData.tipoCedula} onChange={handleChange}>
              <option>Seleccione...</option>
              <option value="V">V</option>
              <option value="E">E</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel controlId="cedula" label="Numero de Cedula" className="mb-3">
            <Form.Control
              size="sm"
              type="number"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="12345678"
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col>
          <FloatingLabel controlId="nombres" label="Nombres" className="mb-3">
            <Form.Control
              size="sm"
              type="text"
              name="nombres"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel controlId="apellidos" label="Apellidos" className="mb-3">
            <Form.Control
              size="sm"
              type="text"
              name="apellidos"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="Apellido"
            />
          </FloatingLabel>
        </Col>
      </Row>
      <hr></hr>
      {/* DATOS PERSONALES */}
      <Row>
        <Col>
          <FloatingLabel controlId="email" label="Correo Electronico" className="mb-3">
            <Form.Control
              size="sm"
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
              size="sm"
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
          <FloatingLabel controlId="enfCode" label="Codigo Enfermero" className="mb-3">
            <Form.Control name="enfCode" value={formData.enfCode} onChange={handleChange} />
          </FloatingLabel>
        </Col>
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
      <hr></hr>
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

export default EnfermeroForm;
