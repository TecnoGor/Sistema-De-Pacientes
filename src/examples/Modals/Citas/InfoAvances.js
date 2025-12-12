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

function InfoAvances({ show, close, id_conmed }) {
  const id = id_conmed;
  const [avances, setAvances] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdvance, setIsAdvance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [getId, setGetId] = useState(null);
  const API_Host = process.env.REACT_APP_API_URL;
  let i = 1;

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("us-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return "Fecha inválida";
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

  const formatToYYYYMMDD = (dateString) => {
    if (!dateString) return "2025-08-09"; // Fecha por defecto en formato correcto

    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      return "2025-08-09";
    }
  };

  const fetchAvances = async () => {
    // console.log(API_Host);
    try {
      console.log(id_conmed);
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_Host}/api/sesiones/${id_conmed}`);
      setAvances(response.data);
      console.log(avances);
    } catch (err) {
      console.log("Error al obtener los avances", err);
      setError("Error al cargar los avances. Intentelo de nuevo.", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvances();
  }, []);

  const columns = [
    { Header: "ID", accessor: "id_avances", width: "10%" },
    { Header: "Tiempo de Tratamiento", accessor: "tiempo_tratamiento", width: "10%" },
    { Header: "Proxima Cita", accessor: "fecha_avance", width: "20%" },
    { Header: "Estado Actual", accessor: "estado_paciente", width: "20%" },
    { Header: "Diagnostico", accessor: "diagnostico_avance", width: "15%" },
    { Header: "Fecha de Avance", accessor: "fecha_registro", width: "15%" },
  ];

  const rows = avances.map((avance) => ({
    id_avances: i++,
    tiempo_tratamiento: avance.tiempo_tratamiento,
    fecha_avance: formatDateForDisplay(avance.fecha_avance),
    estado_paciente: avance.estado_paciente,
    diagnostico_avance: avance.diagnostico_avance,
    fecha_registro: formatDateForDisplay(avance.fecha_registro),
  }));

  return (
    <Modal
      show={show}
      onHide={close}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Datos de Sesion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={true}
            entriesPerPage={true}
            showTotalEntries={true}
            noEndBorder
            pagination={{ variant: "gradient", color: "info" }}
          />
        </MDBox>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

InfoAvances.defaultProps = {
  show: false,
};

InfoAvances.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  id_conmed: PropTypes.number,
};

export default InfoAvances;
