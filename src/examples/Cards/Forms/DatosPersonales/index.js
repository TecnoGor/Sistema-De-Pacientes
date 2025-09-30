import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
import RegRepresentante from "examples/Modals/Representantes/RegRepresentante";
import PropTypes from "prop-types";

function DatosPersonales({ formDataPersonales, handleChange }) {
  // const [formData, setFormData] = useState({
  //   fechaNac: "",
  //   profesion: "",
  //   email: "",
  //   telefono: "",
  //   edoCivil: "",
  //   nivInst: "",
  //   estado: "",
  //   municipio: "",
  //   parroquia: "",
  //   direccion: "",
  // });
  const [show, setShow] = useState(false);
  const handleCloseRep = () => setShow(false);
  const handleShowRep = () => setShow(true);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   // Si cambia la fecha de nacimiento, actualizamos profesión si es necesario
  //   if (name === "bdate") {
  //     const nuevoFormData = { ...formData, [name]: value };
  //     if (esMenorEdad(value)) {
  //       nuevoFormData.profesion = "N/A";
  //     }
  //     setFormData(nuevoFormData);
  //   } else {
  //     setFormData({ ...formData, [name]: value });
  //   }
  // };

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
            <FloatingLabel controlId="mail" label="Correo Electronico" className="mb-3">
              <Form.Control
                type="email"
                name="mail"
                value={formDataPersonales.mail}
                onChange={handleChange}
                placeholder="jhon@email.com"
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="phone" label="Telefono Celular / Local" className="mb-3">
              <Form.Control
                type="text"
                name="phone"
                value={formDataPersonales.phone}
                onChange={handleChange}
                placeholder="+58-416-123-4567"
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col>
            <FloatingLabel controlId="bdate" label="Fecha de nacimiento" className="mb-3">
              <Form.Control
                type="date"
                name="bdate"
                value={formDataPersonales.bdate}
                onChange={handleChange}
                placeholder="01/01/2005"
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="scivil" label="Estado Civil" className="mb-3">
              <Form.Select name="scivil" value={formDataPersonales.scivil} onChange={handleChange}>
                <option value="">Seleccione...</option>
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Concubino">Concubino</option>
                <option value="Viudo">Viudo</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="studios" label="Grado de Instruccion" className="mb-3">
              <Form.Select
                name="studios"
                value={formDataPersonales.studios}
                onChange={handleChange}
              >
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
        {!esMenorEdad(formDataPersonales.bdate) ? (
          <Row>
            <Col>
              <FloatingLabel controlId="ocupation" label="Profesion/Ocupacion" className="mb-3">
                <Form.Control
                  as="textarea"
                  name="ocupation"
                  value={formDataPersonales.ocupation}
                  onChange={handleChange}
                  placeholder="A que se dedica o que profesion ocupa"
                  style={{ height: "100px" }}
                />
              </FloatingLabel>
            </Col>
          </Row>
        ) : (
          <input type="hidden" name="ocupation" value="N/A" />
        )}

        <Row>
          <Col>
            <FloatingLabel controlId="state" label="Estado" className="mb-3">
              <Form.Select name="state" value={formDataPersonales.state} onChange={handleChange}>
                <option value="">Seleccione...</option>
                <option value="Distrito Capital">Distrito Capital</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="municipio" label="Municipios" className="mb-3">
              <Form.Select
                name="municipio"
                value={formDataPersonales.municipio}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="Libertador">Libertador</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="parroquia" label="Parroquia" className="mb-3">
              <Form.Select
                name="parroquia"
                value={formDataPersonales.parroquia}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="San Juan">San Juan</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col>
            <FloatingLabel controlId="dirhouse" label="Direccion de Habitacion" className="mb-3">
              <Form.Control
                as="textarea"
                name="dirhouse"
                value={formDataPersonales.dirhouse}
                onChange={handleChange}
                placeholder="Direccion de habitacion donde reside"
                style={{ height: "100px" }}
              />
            </FloatingLabel>
          </Col>
        </Row>
        {esMenorEdad(formDataPersonales.bdate) && (
          <Button variant="primary" onClick={handleShowRep}>
            Registrar Representante
          </Button>
        )}
      </Form>
      <RegRepresentante hClose={handleCloseRep} show={show} />
    </>
  );
}

DatosPersonales.propTypes = {
  formDataPersonales: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default DatosPersonales;
