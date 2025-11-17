import React from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
            value={formData.firstname}
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
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="text"
            label="Cédula"
            variant="standard"
            fullWidth
            name="ci"
            value={formData.ci}
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
            name="username"
            value={formData.username}
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
            value={formData.password}
            onChange={handleChange}
            required
          />
        </MDBox>
    </Form>
  );
}

UsuarioForm.propTypes = {
  formDataPersona: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default UsuarioForm;
