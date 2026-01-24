import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import Swal from "sweetalert2";

function EditUsuario({ formDataUsuario, handleChange }) {
  const [roles, setRoles] = useState([]);
  const API_Host = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const response = await axios.get(`${API_Host}/api/roles`);
        console.log(response.data);
        setRoles(response.data);
      } catch (error) {
        console.error("Error al cargar Roles:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los Roles",
          icon: "error",
          draggable: true,
        });
      }
    };
    cargarRoles();
  }, []);

  return (
    <Form>
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
            <option value="">Seleccione un médico...</option>
            {roles.map((role) => (
              <option key={role.id_rol} value={role.id_rol}>
                {role.nrol}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </MDBox>
    </Form>
  );
}

EditUsuario.propTypes = {
  formDataUsuario: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default EditUsuario;
