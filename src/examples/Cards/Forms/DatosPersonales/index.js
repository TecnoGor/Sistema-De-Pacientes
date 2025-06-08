import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import RegRepresentante from "examples/Modals/Representantes/RegRepresentante";

function DatosPersonales() {
  const [formData, setFormData] = useState({
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
  const [show, setShow] = useState(false);
  const handleCloseRep = () => setShow(false);
  const handleShowRep = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia la fecha de nacimiento, actualizamos profesión si es necesario
    if (name === "fechaNac") {
      const nuevoFormData = { ...formData, [name]: value };
      if (esMenorEdad(value)) {
        nuevoFormData.profesion = "N/A";
      }
      setFormData(nuevoFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const esMenorEdad = (fecha) => {
    if (!fecha) return false;

    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad < 18;
  };

  return (
    <>
      <Form>
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
        {!esMenorEdad(formData.fechaNac) ? (
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
        ) : (
          <input type="hidden" name="profesion" value="N/A" />
        )}

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
        {esMenorEdad(formData.fechaNac) && (
          <Button variant="primary" onClick={handleShowRep}>
            Registrar Representante
          </Button>
        )}
      </Form>
      <RegRepresentante hClose={handleCloseRep} show={show} />
    </>
  );
}

export default DatosPersonales;
