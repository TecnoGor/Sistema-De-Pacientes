/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
// import Carnet from "examples/Cards/Carnet";

import InfoCita from "examples/Modals/Citas/InfoCita";
import InfoAvances from "examples/Modals/Citas/InfoAvances";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

function Citas() {
  const [show, setShow] = useState(false);
  const [citas, setCitas] = useState([]);
  const [getId, setGetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAvances, setShowAvances] = useState(false);
  const handleCloseAvances = () => {
    setShowAvances(false);
    setGetId(null);
  };
  const handleShowAvances = (a) => {
    setGetId(a);
    setShowAvances(true);
  };
  const handleCloseCita = () => {
    setShow(false);
    setGetId(null);
  };
  const handleShowCita = (a) => {
    setGetId(a);
    setShow(true);
  };
  let i = 1;
  const API_Host = process.env.REACT_APP_API_URL;

  const fetchCitas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_Host}/api/consultasMedicas`);
      setCitas(response.data);
    } catch (err) {
      console.log("Error al obtener Consultas", err);
      setError("Error al cargar las Consultas. Intentelo de nuevo.", err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  // Función para convertir a formato YYYY-MM-DD (para filtros)
  const formatDateForFilter = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      return new Date().toISOString().split("T")[0];
    }
  };

  const getStatusBadge = (status) => {
    if (status === 1 || status === "1" || status === true) {
      return (
        <MDBox
          display="inline-flex"
          alignItems="center"
          px={2}
          py={0.5}
          borderRadius="md"
          sx={{
            backgroundColor: "success.main",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          <Icon sx={{ fontSize: "0.875rem", mr: 0.5 }}>check_circle</Icon>
          Activo
        </MDBox>
      );
    } else if (status === 0 || status === "0" || status === false) {
      return (
        <MDBox
          display="inline-flex"
          alignItems="center"
          px={2}
          py={0.5}
          borderRadius="md"
          sx={{
            backgroundColor: "error.main",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          <Icon sx={{ fontSize: "0.875rem", mr: 0.5 }}>cancel</Icon>
          Inactivo
        </MDBox>
      );
    }

    return (
      <MDBox
        display="inline-flex"
        alignItems="center"
        px={2}
        py={0.5}
        borderRadius="md"
        sx={{
          backgroundColor: "warning.main",
          color: "white",
          fontSize: "0.75rem",
          fontWeight: "bold",
        }}
      >
        <Icon sx={{ fontSize: "0.875rem", mr: 0.5 }}>help</Icon>
        Desconocido
      </MDBox>
    );
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const columns = [
    { Header: "ID", accessor: "id_citas", width: "10%" },
    { Header: "Paciente", accessor: "nombresP", width: "20%" },
    { Header: "Médico", accessor: "nombresM", width: "20%" },
    {
      Header: "Status",
      accessor: "status",
      width: "20%",
      Cell: ({ value }) => getStatusBadge(value),
    },
    {
      Header: "Fecha de Cita",
      accessor: "fecha_cita",
      width: "15%",
      Cell: ({ value, row }) => row.original._fechaDisplay || value,
    },
    { Header: "Acciones", accessor: "actions", width: "15%" },
  ];

  const rows = citas.map((cita) => ({
    id_citas: i++,
    nombresP:
      cita.nombres_paciente + " " + cita.apellidos_paciente + " - V-" + cita.cedula_paciente,
    // cedulaP: cita.cedula_paciente,
    nombresM:
      cita.nombres_medico +
      " " +
      cita.apellidos_medico +
      " - " +
      cita.tipoci_medico +
      "-" +
      cita.cedula_medico,
    status: cita.status,
    fecha_cita: formatDateForFilter(cita.fechaconsul),
    actions: (
      <MDBox display="flex" gap={1}>
        <MDButton
          onClick={() => handleShowCita(cita.id_conmed)}
          variant="text"
          color="info"
          size="large"
        >
          <Icon>info</Icon>&nbsp;
        </MDButton>
        <MDButton
          onClick={() => handleShowAvances(cita.id_conmed)}
          variant="text"
          color="info"
          size="large"
        >
          <Icon>visibility</Icon>&nbsp;
        </MDButton>
        {/* <MDButton variant="text" color="error" size="small">
          <Icon>delete</Icon>&nbsp;Eliminar
        </MDButton> */}
      </MDBox>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDButton variant="gradient" color="dark" onClick={handleShow}>
                  <Icon sx={{ fontWeight: "bold" }}>person</Icon>
                  &nbsp;Registrar Consultas
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <RegConsultas close={handleClose} show={show} fetch={fetchConsultas} />
              </MDBox>
            </Card>
          </Grid> */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Citas Medicas
                </MDTypography>
              </MDBox>
              <MDBox>
                <InfoAvances close={handleCloseAvances} show={showAvances} id_conmed={getId} />
                <InfoCita
                  close={handleCloseCita}
                  show={show}
                  fetch={fetchCitas}
                  id_conmed={getId}
                />
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      Cargando Citas...
                    </MDTypography>
                  </MDBox>
                ) : error ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="error">
                      {error}
                    </MDTypography>
                    <MDButton color="info" onClick={fetchCitas} sx={{ mt: 2 }}>
                      <Icon>refresh</Icon>&nbsp;Reintentar
                    </MDButton>
                  </MDBox>
                ) : citas.length === 0 ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      No hay citas registradas
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={true}
                    entriesPerPage={true}
                    showTotalEntries={true}
                    showFilters={true}
                    defaultToday={true} // ← Esta prop mostrará solo las citas de hoy
                    noEndBorder
                    pagination={{ variant: "gradient", color: "info" }}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Citas;
