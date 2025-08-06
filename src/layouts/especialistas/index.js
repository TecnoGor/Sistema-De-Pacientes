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
import React, { useEffect, useState } from "react";
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
import RegPersonalMedico from "examples/Modals/PersonalMedico/RegPersonalMedico";
import DataTable from "examples/Tables/DataTable";
// import Carnet from "examples/Cards/Carnet";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

function Especialistas() {
  const [show, setShow] = useState(false);
  const [especialistas, setEspecialistas] = useState([]);
  const [loadingEspecialistas, setloadingEspecialistas] = useState(true);
  const [error, setError] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const API_Host = process.env.REACT_APP_API_URL;

  const fetchEspecialistas = async () => {
    try {
      setloadingEspecialistas(true);
      setError(null);
      const response = await axios.get(`${API_Host}/api/especialistas`);
      setEspecialistas(response.data);
    } catch (err) {
      console.log("Error al obtener especialistas", err);
      setError("Error al cargar los especialistas. Intentelo de nuevo.", err.message);
    } finally {
      setloadingEspecialistas(false);
    }
  };

  useEffect(() => {
    fetchEspecialistas();
  }, []);

  const columns = [
    { Header: "ID", accessor: "id_especialista", width: "10%" },
    { Header: "Nombres", accessor: "nombres", width: "20%" },
    { Header: "Apellidos", accessor: "apellidos", width: "20%" },
    { Header: "Cédula", accessor: "cedula", width: "15%" },
    { Header: "Acciones", accessor: "actions", width: "15%" },
  ];

  const rows = especialistas.map((especialista) => ({
    id_especialista: especialista.id_persona,
    nombres: especialista.nombres,
    apellidos: especialista.apellidos,
    cedula: especialista.cedula,
    actions: (
      <MDBox display="flex" gap={1}>
        <MDButton variant="text" color="info" size="small">
          <Icon>edit</Icon>&nbsp;Editar
        </MDButton>
        <MDButton variant="text" color="error" size="small">
          <Icon>delete</Icon>&nbsp;Eliminar
        </MDButton>
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
                <MDTypography variant="h6" color="white">
                  Authors Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
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
                <MDButton variant="gradient" color="dark" onClick={handleShow}>
                  <Icon sx={{ fontWeight: "bold" }}>person</Icon>
                  &nbsp;Registrar Personal
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <RegPersonalMedico hClose={handleClose} show={show} />
              </MDBox>
            </Card>
          </Grid>
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
                  Especialistas
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loadingEspecialistas ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      Cargando Especialistas...
                    </MDTypography>
                  </MDBox>
                ) : error ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="error">
                      {error}
                    </MDTypography>
                    <MDButton color="info" onClick={fetchEspecialistas} sx={{ mt: 2 }}>
                      <Icon>refresh</Icon>&nbsp;Reintentar
                    </MDButton>
                  </MDBox>
                ) : especialistas.length === 0 ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      No hay especialistas registrados
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={true}
                    entriesPerPage={true}
                    showTotalEntries={true}
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

export default Especialistas;
