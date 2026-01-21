import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import { Grid, Icon, CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import Swal from "sweetalert2";

function RolesFunctions({ show, close, id_rol }) {
  const [assignedFunctions, setAssignedFunctions] = useState([]); // Funciones que ya tiene
  const [availableFunctions, setAvailableFunctions] = useState([]); // Funciones que NO tiene
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");

  // 1. Cargar datos del servidor
  const fetchData = useCallback(async () => {
    if (!id_rol) return;
    try {
      setLoading(true);
      // Petición para obtener funciones actuales del rol y funciones totales
      const response = await fetch(`${process.env.REACT_APP_API_URL}/roles/${id_rol}/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setAssignedFunctions(data.assigned);
        setAvailableFunctions(data.available);
      }
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los permisos", "error");
    } finally {
      setLoading(false);
    }
  }, [id_rol, token]);

  useEffect(() => {
    if (show && id_rol) fetchData();
  }, [show, id_rol, fetchData]);

  // 2. Función para ASIGNAR un permiso
  const handleAddPermission = async (funcionid) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/roles/assign-permission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rolid: id_rol, funcionid }),
      });
      if (response.ok) {
        fetchData(); // Recargar tablas
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo asignar el permiso", "error");
    }
  };

  // 3. Función para QUITAR un permiso
  const handleRemovePermission = async (funcionid) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/roles/remove-permission`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rolid: id_rol, funcionid }),
      });
      if (response.ok) {
        fetchData(); // Recargar tablas
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar el permiso", "error");
    }
  };

  // Definición de columnas
  const columns = [
    { Header: "Función", accessor: "nfuncion", width: "70%" },
    { Header: "Acción", accessor: "action", width: "30%", align: "center" },
  ];

  // Filas para permisos ACTUALES
  const rowsAssigned = assignedFunctions.map((f) => ({
    nfuncion: f.nfuncion,
    action: (
      <MDButton color="error" variant="text" onClick={() => handleRemovePermission(f.id_funcion)}>
        <Icon>delete</Icon>
      </MDButton>
    ),
  }));

  // Filas para permisos DISPONIBLES
  const rowsAvailable = availableFunctions.map((f) => ({
    nfuncion: f.nfuncion,
    action: (
      <MDButton color="success" variant="text" onClick={() => handleAddPermission(f.id_funcion)}>
        <Icon>add_circle</Icon>
      </MDButton>
    ),
  }));

  return (
    <Modal show={show} onHide={close} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Gestión de Permisos para el Rol #{id_rol}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <MDBox display="flex" justifyContent="center" p={5}>
            <CircularProgress color="info" />
          </MDBox>
        ) : (
          <Grid container spacing={3}>
            {/* Tabla de la Izquierda: Permisos que NO TIENE */}
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDTypography variant="h6" color="success">
                  Funciones Disponibles
                </MDTypography>
              </MDBox>
              <DataTable
                table={{ columns, rows: rowsAvailable }}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            </Grid>

            {/* Tabla de la Derecha: Permisos que YA TIENE */}
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDTypography variant="h6" color="info">
                  Funciones Asignadas
                </MDTypography>
              </MDBox>
              <DataTable
                table={{ columns, rows: rowsAssigned }}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            </Grid>
          </Grid>
        )}
      </Modal.Body>
      <Modal.Footer>
        <MDButton variant="gradient" color="dark" onClick={close}>
          Finalizar
        </MDButton>
      </Modal.Footer>
    </Modal>
  );
}

RolesFunctions.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  id_rol: PropTypes.number,
};

export default RolesFunctions;
