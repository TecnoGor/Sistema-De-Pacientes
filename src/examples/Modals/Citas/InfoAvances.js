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
      const response = await axios.get(`${API_Host}/api/sesiones/${id}`);
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
    if (show && id) {
      fetchAvances();
    }
  }, [show, id]);

  const columns = [
    { Header: "ID", accessor: "id_avances", width: "10%" },
    { Header: "Protocolo", accessor: "protocolo", width: "10%" },
    { Header: "Tiempo de Protocolo", accessor: "tiempo_protocolo", width: "10%" },
    { Header: "Proxima Sesion", accessor: "fecha_avance", width: "20%" },
    { Header: "Presion Arterial Antes", accessor: "parterial_before", width: "15%" },
    { Header: "Presion Arterial Despues", accessor: "parterial_after", width: "15%" },
    { Header: "Pulso Antes", accessor: "pulso_before", width: "15%" },
    { Header: "Pulso Despues", accessor: "pulso_after", width: "15%" },
    { Header: "Fecha de Sesion", accessor: "fecha_registro", width: "15%" },
  ];

  const rows = avances.map((avance) => ({
    id_avances: i++,
    protocolo: avance.protocolo,
    tiempo_protocolo: avance.tiempo_protocolo,
    fecha_avance: formatDateForDisplay(avance.proxima_sesion),
    parterial_before: avance.parterial_before,
    estatura_before: avance.estatura_before,
    peso_before: avance.peso_before,
    saturacion_before: avance.saturacion_before,
    pulso_before: avance.pulso_before,
    frespiratoria_before: avance.frespiratoria_before,
    parterial_after: avance.parterial_after,
    estatura_after: avance.estatura_after,
    peso_after: avance.peso_after,
    saturacion_after: avance.saturacion_after,
    pulso_after: avance.pulso_after,
    frespiratoria_after: avance.frespiratoria_after,
    fecha_registro: formatDateForDisplay(avance.fecha_sesion),
  }));

  return (
    <Modal
      show={show}
      onHide={close}
      size="lg"
      dialogClassName="modal-90w"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Datos de Sesión</Modal.Title>
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
