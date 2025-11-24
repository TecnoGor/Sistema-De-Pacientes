import React from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

function UsuarioForm({ formDataUsuario, handleChange }) {
  return (
    <Form>
      <MDBox mb={2}>
        <MDInput
          type="text"
          label="Nombre"
          variant="standard"
          fullWidth
          name="firstname"
          value={formDataUsuario.firstname}
          onChange={handleChange}
          required
        />
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="text"
          label="Apellido"
          variant="standard"
          fullWidth
          name="lastname"
          value={formDataUsuario.lastname}
          onChange={handleChange}
          required
        />
      </MDBox>
      <MDBox mb={2}>
        <Form.Label>Seleccione</Form.Label>
        <Form.Select
          aria-label="Default example"
          value={formDataUsuario.typeCi || ""}
          name="typeCi"
          onChange={handleChange}
        >
          <option disabled>Seleccione...</option>
          <option value="V">V</option>
          <option value="E">E</option>
        </Form.Select>
        <MDInput
          type="text"
          label="Cédula"
          variant="standard"
          fullWidth
          name="ci"
          value={formDataUsuario.ci}
          onChange={handleChange}
          required
        />
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="text"
          label="Usuario"
          variant="standard"
          fullWidth
          name="nuser"
          value={formDataUsuario.nuser}
          onChange={handleChange}
          required
        />
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="password"
          label="Contraseña"
          variant="standard"
          fullWidth
          name="password"
          value={formDataUsuario.password}
          onChange={handleChange}
          required
        />
      </MDBox>
      <MDBox>
        <Form.Group className="mb-3" controlId="tipoCed.ControlSelect1">
          <Form.Label>Rol</Form.Label>
          <Form.Select
            aria-label="Default example"
            value={formDataUsuario.rol || ""}
            name="rol"
            onChange={handleChange}
          >
            <option disabled>Seleccione...</option>
            <option value="2">Enfermero</option>
            <option value="3">Medico</option>
          </Form.Select>
        </Form.Group>
      </MDBox>
    </Form>
  );
}

UsuarioForm.propTypes = {
  formDataUsuario: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default UsuarioForm;
