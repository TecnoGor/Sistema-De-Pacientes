import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import RoleForm from "examples/Cards/Forms/Roles";

function RegRol({ show, close, fetchRoles }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const API_Host = process.env.REACT_APP_API_URL;
  const [formDataRol, setFormDataRol] = useState({
    nrol: "",
    descrypt: "",
    status: 1,
  });
  let i = 1;

  const handleSubmit = async () => {
    // Validación básica antes de enviar
    if (!formDataRol.nrol || formDataRol.nrol.trim() === "") {
      setErrors({ nrol: "El nombre del rol es obligatorio" });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_Host}/api/regRol`, formDataRol, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          title: "¡Rol Registrado!",
          text: "El rol se ha creado correctamente.",
          icon: "success",
        });

        setFormDataRol({ nrol: "", status: 1 }); // Resetear formulario
        if (fetchRoles) fetchRoles(); // Refrescar la tabla de roles principal
        close(); // Cerrar el modal
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo registrar el rol",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataRol((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <Modal show={show} onHide={close} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nuevo Rol</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MDBox p={2}>
          {/* Pasamos los props correctamente al formulario */}
          <RoleForm formDataRol={formDataRol} handleChange={handleChange} errors={errors} />
        </MDBox>
      </Modal.Body>
      <Modal.Footer>
        <MDButton color="secondary" onClick={close} disabled={loading}>
          Cancelar
        </MDButton>
        <MDButton variant="gradient" color="info" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar Rol"}
        </MDButton>
      </Modal.Footer>
    </Modal>
  );
}

RegRol.defaultProps = {
  show: false,
};

RegRol.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  fetchRoles: PropTypes.func,
};

export default RegRol;
