import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap";
// import RegRepresentante from "examples/Modals/Representantes/RegRepresentante";
import PropTypes from "prop-types";

function ExamPhisique({ formExamPhisique, handleChange }) {
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

  return (
    <>
      <Form>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="cedula.ControlInput1">
              <Form.Label>Piel</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.piel || ""}
                name="piel"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="nombres.ControlInput2">
              <Form.Label>Cabeza</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.cabeza || ""}
                name="cabeza"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
              <Form.Label>Ojos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.lastname || ""}
                name="lastname"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="cedula.ControlInput1">
              <Form.Label>Oido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.oido || ""}
                name="oido"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="nombres.ControlInput2">
              <Form.Label>Nariz</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.nariz || ""}
                name="nariz"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
              <Form.Label>Boca</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.boca || ""}
                name="boca"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="cedula.ControlInput1">
              <Form.Label>Faringe</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.faringe || ""}
                name="faringe"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="nombres.ControlInput2">
              <Form.Label>Cuello</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.cuello || ""}
                name="cuello"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
              <Form.Label>Ganglios Linfaticos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.glinfaticos || ""}
                name="glinfaticos"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="cedula.ControlInput1">
              <Form.Label>Tórax</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.torax || ""}
                name="torax"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="nombres.ControlInput2">
              <Form.Label>Senos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.senos || ""}
                name="senos"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
              <Form.Label>Pulmones</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.pulmones || ""}
                name="pulmones"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="cedula.ControlInput1">
              <Form.Label>Corazón</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.corazon || ""}
                name="corazon"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="nombres.ControlInput2">
              <Form.Label>Vasos Sanguíneos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.vsanguineos || ""}
                name="vsanguineos"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
              <Form.Label>Abdomen</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.abdomen || ""}
                name="abdomen"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="cedula.ControlInput1">
              <Form.Label>Genitales</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.genitales || ""}
                name="genitales"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="nombres.ControlInput2">
              <Form.Label>Recto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.recto || ""}
                name="recto"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="apellidos.ControlInput3">
              <Form.Label>Extremidades</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripcion"
                value={formExamPhisique.extremidades || ""}
                name="extremidades"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </>
  );
}

ExamPhisique.propTypes = {
  formExamPhisique: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ExamPhisique;
