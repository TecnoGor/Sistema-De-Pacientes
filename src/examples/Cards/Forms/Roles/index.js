import React from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

function RoleForm({ formDataRol, handleChange }) {
  return (
    <Form>
      <MDBox mb={2}>
        <MDInput
          type="text"
          label="Nombre de Rol"
          fullWidth
          name="nrol"
          value={formDataRol.nrol}
          onChange={handleChange}
        />
      </MDBox>
      <hr />
      <MDBox>
        <MDInput
          type="text"
          label="Descripcion de Rol"
          fullWidth
          name="descrypt"
          value={formDataRol.descrypt}
          onChange={handleChange}
        />
      </MDBox>
    </Form>
  );
}

RoleForm.propTypes = {
  formDataRol: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default RoleForm;
