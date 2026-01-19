/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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
import { useEffect, useState } from "react";
import axios from "axios";
// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";

// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function Data() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // let procentajeAvance = 0;
  const API_Host = process.env.REACT_APP_API_URL;

  // Función para formatear fecha
  const fechaMuestra = (ultimaProximaCita, fechaConsulta) => {
    if (ultimaProximaCita) {
      return new Date(ultimaProximaCita).toLocaleDateString();
    }
    if (fechaConsulta) {
      return new Date(fechaConsulta).toLocaleDateString();
    }
    return "Sin fecha";
  };

  const getPorcentaje = (a, b) => {
    let procentajeAvance = 0;
    if (a === 0 || a === null) {
      procentajeAvance = 0;
      console.log(procentajeAvance);
      return procentajeAvance;
    } else {
      procentajeAvance = (a * 100) / b;
      console.log(procentajeAvance);
      return procentajeAvance;
    }
  };

  // Función para obtener el estado como badge
  const getEstadoBadge = (status) => {
    switch (status) {
      case true:
        return (
          <MDTypography variant="caption" color="success" fontWeight="medium">
            Activo
          </MDTypography>
        );
      case false:
        return (
          <MDTypography variant="caption" color="error" fontWeight="medium">
            Finalizado
          </MDTypography>
        );
      default:
        return (
          <MDTypography variant="caption" color="warning" fontWeight="medium">
            Desconocido
          </MDTypography>
        );
    }
  };

  const fetchCitas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_Host}/api/dashboardProgressPacientes`);
      setCitas(response.data);
    } catch (err) {
      console.log("Error al obtener Consultas", err);
      setError("Error al cargar las Consultas. Inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const avatars = (members) =>
    members.map(([image, name]) => (
      <Tooltip key={name} title={name} placeholder="bottom">
        <MDAvatar
          src={image}
          alt="name"
          size="xs"
          sx={{
            border: ({ borders: { borderWidth }, palette: { white } }) =>
              `${borderWidth[2]} solid ${white.main}`,
            cursor: "pointer",
            position: "relative",

            "&:not(:first-of-type)": {
              ml: -1.25,
            },

            "&:hover, &:focus": {
              zIndex: "10",
            },
          }}
        />
      </Tooltip>
    ));

  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  // Contador para IDs (si es necesario)
  let i = 1;

  // Si está cargando, devolver datos vacíos o de carga
  if (loading) {
    return {
      columns: [
        { Header: "companies", accessor: "companies", width: "45%", align: "left" },
        { Header: "members", accessor: "members", width: "10%", align: "left" },
        { Header: "budget", accessor: "budget", align: "center" },
        { Header: "completion", accessor: "completion", align: "center" },
      ],
      rows: [],
    };
  }

  // Si hay error, devolver datos vacíos o con mensaje de error
  if (error) {
    return {
      columns: [
        { Header: "companies", accessor: "companies", width: "45%", align: "left" },
        { Header: "members", accessor: "members", width: "10%", align: "left" },
        { Header: "budget", accessor: "budget", align: "center" },
        { Header: "completion", accessor: "completion", align: "center" },
      ],
      rows: [
        {
          companies: <MDTypography color="error">Error al cargar datos</MDTypography>,
          members: "",
          budget: "",
          completion: "",
        },
      ],
    };
  }

  return {
    columns: [
      { Header: "Paciente", accessor: "paciente", width: "20%", align: "left" },
      { Header: "Médico", accessor: "medico", width: "20%", align: "left" },
      { Header: "Estado", accessor: "estado", width: "15%", align: "center" },
      { Header: "Proxima Cita", accessor: "fecha", width: "15%", align: "center" },
      { Header: "Sesiones Planificadas", accessor: "sesiones", width: "15%", align: "center" },
      { Header: "Progreso", accessor: "progressBar", width: "30%", align: "center" },
    ],

    rows: citas.map((cita) => ({
      paciente: (
        <MDTypography variant="button" fontWeight="medium">
          {cita.nombres_paciente} {cita.apellidos_paciente}
          <br />
          <MDTypography variant="caption" color="textSecondary">
            V-{cita.cedula_paciente}
          </MDTypography>
        </MDTypography>
      ),
      medico: (
        <MDTypography variant="button" fontWeight="medium">
          {cita.nombres_medico} {cita.apellidos_medico}
          <br />
          <MDTypography variant="caption" color="textSecondary">
            {cita.tipoci_medico || "V"}-{cita.cedula_medico}
          </MDTypography>
        </MDTypography>
      ),
      estado: getEstadoBadge(cita.status),
      fecha: fechaMuestra(cita.ultima_proxima_cita, cita.fechaconsul),
      sesiones: cita.sesiones_planificadas,
      progressBar: (
        <MDBox width="8rem" textAlign="left">
          <MDProgress
            value={getPorcentaje(cita.total_sesiones_realizadas, cita.sesiones_planificadas)}
            color="info"
            variant="gradient"
            label={true}
          />
        </MDBox>
        // <MDBox display="flex" gap={1}>
        //   <MDButton
        //     // onClick={() => handleShowCita && handleShowCita(cita.id_conmed)}
        //     variant="text"
        //     color="info"
        //     size="small"
        //   >
        //     <Icon fontSize="small">info</Icon>
        //   </MDButton>
        //   <MDButton
        //     // onClick={() => handleShowAvances && handleShowAvances(cita.id_conmed)}
        //     variant="text"
        //     color="info"
        //     size="small"
        //   >
        //     <Icon fontSize="small">visibility</Icon>
        //   </MDButton>
        // </MDBox>
      ),
    })),
  };
}

// Si quieres mantener el formato original de ejemplo, aquí está esa versión:
/*
export default function data() {
  // ... mismo código hasta el return ...

  return {
    columns: [
      { Header: "companies", accessor: "companies", width: "45%", align: "left" },
      { Header: "members", accessor: "members", width: "10%", align: "left" },
      { Header: "budget", accessor: "budget", align: "center" },
      { Header: "completion", accessor: "completion", align: "center" },
    ],

    rows: [
      {
        companies: <Company image={logoXD} name="Material UI XD Version" />,
        members: (
          <MDBox display="flex" py={1}>
            {avatars([
              [team1, "Ryan Tompson"],
              [team2, "Romina Hadid"],
              [team3, "Alexander Smith"],
              [team4, "Jessica Doe"],
            ])}
          </MDBox>
        ),
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            $14,000
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={60} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      // ... resto de filas de ejemplo ...
    ],
  };
}
*/
