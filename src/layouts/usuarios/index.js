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
import { useEffect, useState } from "react";
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
import RegPacientes from "examples/Modals/Pacientes/RegPacientes";
import DataTable from "examples/Tables/DataTable";
// import Carnet from "examples/Cards/Carnet";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

function Users() {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();
  const API_Host = process.env.REACT_APP_API_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_Host}/api/users`);
      setUsers(response.data);
    } catch (error) {
      // console.log("Error al cargar los pacientes: ", error);
      setError("Error al cargar los pacientes. Intentelo de nuevo. ", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  });

  const columns = [
    { Header: "ID", accessor: "id_usuario", width: "10%" },
    { Header: "Nombre de Usuario", accessor: "nuser", width: "20%" },
    { Header: "Rol", accessor: "rolid", width: "20%" },
    { Header: "Fecha de Creación", accessor: "fechacreacion", width: "15%" },
    { Header: "Acciones", accessor: "actions", width: "15%" },
  ];

  const rows = users.map((user) => ({
    id_usuario: user.id_usuario,
    nuser: user.nuser,
    rol: user.rolid,
    fechacreacion: user.fechacreacion,
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
                  &nbsp;Registrar Usuarios
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      Cargando usuarios...
                    </MDTypography>
                  </MDBox>
                ) : error ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="error">
                      {error}
                    </MDTypography>
                    <MDButton color="info" onClick={fetchUsers} sx={{ mt: 2 }}>
                      <Icon>refresh</Icon>&nbsp;Reintentar
                    </MDButton>
                  </MDBox>
                ) : users.length === 0 ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      No hay usuarios registrados
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
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Users;
