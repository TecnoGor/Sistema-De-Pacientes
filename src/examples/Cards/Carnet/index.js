import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import BlobStream from "blob-stream";
import PropTypes from "prop-types";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CarnetQR from "components/MDQr";
import CarnetImprimible from "./CarnetImprimible";
// import CamaraCarnetizacion from "./Camara";

// Images
import pattern from "assets/images/1-02.png";
import bgImage from "assets/images/carnetDesign/CARNET-01.png";
import logoIpos from "assets/images/ipostel.png";
import logoHeader from "assets/images/carnetDesign/Logos_Ipostel-04.png";
import logoHeader2 from "assets/images/carnetDesign/Logos_Ipostel-03.png";
import banner from "assets/images/carnetDesign/CARNET-06.png";
import bandera from "assets/images/carnetDesign/CARNET-03.png";
import people from "assets/images/John_doe.jpg";
import mesa from "assets/images/mesa.jpg";
import masterCardLogo from "assets/images/logos/mastercard.png";
import { border, borderRadius, fontSize, margin, padding, textAlign } from "@mui/system";
import MDInput from "components/MDInput";
import { position } from "stylis";
import { ConstructionOutlined } from "@mui/icons-material";

function Carnet({ color, number, holder, expires }) {
  const [ced, setCed] = useState("");
  const [codger, setCodger] = useState("");
  const [empleado, setEmpleado] = useState("");
  const [colorger, setColor] = useState("green");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState(null);
  const [processedFoto, setProcessedFoto] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [errorCamara, setErrorCamara] = useState(null);
  const fotoRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const componentRef = useRef();

  // Limpiar la cámara al desmontar el componente
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    console.log("Ref actual:", componentRef.current);
  }, [empleado, foto]);

  // Activar la cámara
  const activarCamara = async () => {
    setErrorCamara(null);
    try {
      setMostrarCamara(true);
      // Verificar si el navegador soporta la API de mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Tu navegador no soporta el acceso a la cámara o no tiene los permisos necesarios"
        );
      }
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      setErrorCamara(err.message);
      setMostrarCamara(false);
      // Detener cualquier stream que pueda haberse iniciado parcialmente
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const tomarFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      // Convertir a base64 para guardar o mostrar
      const fotoData = canvasRef.current.toDataURL("image/jpeg", 0.8);
      setFoto(fotoData);
      // Detener la cámara después de tomar la foto
      detenerCamara();
    }
  };

  const processImage = async () => {
    if (!foto) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const targetWidth = 83; // 2.2cm en pixels (2.2*37.8)
    const targetHeight = 113; // 3cm en pixels

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const img = new Image();
    img.src = foto;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Aplicar object-fit: cover
    const ratio = Math.max(targetWidth / img.width, targetHeight / img.height);
    ctx.drawImage(
      img,
      (targetWidth - img.width * ratio) / 2,
      (targetHeight - img.height * ratio) / 2,
      img.width * ratio,
      img.height * ratio
    );

    // Bordes redondeados
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.roundRect(0, 0, targetWidth, targetHeight, 8);
    ctx.fill();

    setProcessedFoto(canvas.toDataURL("image/jpeg"));
  };

  useEffect(() => {
    if (foto) processImage();
  }, [foto]);

  // Detener la cámara
  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setMostrarCamara(false);
    }
  };

  // Guardar foto en la base de datos
  const guardarFoto = async () => {
    if (!foto) {
      alert("No hay foto para guardar");
      return;
    }

    try {
      // Aquí debes implementar la llamada a tu API para guardar en la base de datos
      const respuesta = await fetch("/api/guardar-foto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagen: foto }),
      });

      if (respuesta.ok) {
        alert("Foto guardada exitosamente");
        setFoto(null);
      } else {
        throw new Error("Error al guardar la foto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar la foto");
    }
  };
  const buscarEmpleado = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/empleado/${ced}`);
      console.log(response.data);
      setEmpleado(response.data);
      const codeSinCeros = Number(response.data.codger);
      console.log(codeSinCeros);
      setError("");
      await buscarColor(codeSinCeros);
    } catch (err) {
      setEmpleado(null);
      setError("Empleado no encontrado.");
    }
  };

  const buscarColor = async (codger) => {
    console.log(codger);
    try {
      const response = await axios.get(`http://localhost:5002/api/color_ger/${codger}`);
      console.log(response.data);
      if (response.data && response.data.color) {
        setColor(response.data);
      }
      setError("");
    } catch (err) {
      console.log("Color no encontrado.");
    }
  };

  const handleFotoTomada = (fotoData) => {
    setFotoEmpleado(fotoData);
    // Aquí puedes guardar la foto junto con los datos del empleado
  };

  const abrevName = (name) => {
    const words = name.split(" ");
    if (words.length > 1) {
      words[1] = words[1].charAt(0) + ".";
    }
    const nameAbreviated = words.join(" ");
    return nameAbreviated;
  };

  const numbers = [...`${number}`];

  if (numbers.length < 16 || numbers.length > 16) {
    throw new Error(
      'Invalid value for the prop number, the value for the number prop shouldn"t be greater than or less than 16 digits'
    );
  }

  const generatePDF = async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const element = document.getElementById("carnetImprimible");
    const element2 = document.getElementById("carnetImprimible2");
    const clone = element.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);
    clone.querySelectorAll("*").forEach((el) => {
      el.style.boxShadow = "none";
      // .style.transform = "translateZ(0)";
    });
    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: true,
    });
    document.body.removeChild(clone);
    // 6. Generar PDF
    const pdf = new jsPDF("p", "mm", [55, 85]);
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, 55, 85);

    pdf.addPage();
    const clone2 = element2.cloneNode(true);
    clone2.style.position = "absolute";
    clone2.style.left = "-9999px";
    document.body.appendChild(clone2);
    clone2.querySelectorAll("*").forEach((el) => {
      el.style.boxShadow = "none";
    });
    const canvas2 = await html2canvas(clone2, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: true,
    });
    document.body.removeChild(clone2);
    const imgData2 = canvas2.toDataURL("image/png");
    pdf.addImage(imgData2, "PNG", 0, 0, 55, 85);
    pdf.save("carnet_high_quality.pdf");
  };

  return (
    <Card
      sx={({ boxShadows: { xl } }) => ({
        boxShadow: xl,
        position: "relative",
        backgroundImage: `url(${mesa})`,
      })}
    >
      <MDBox display="flex" zIndex={2} p={2} justifyContent="center">
        <div className="container-camara">
          {/* <h2>Sistema de Carnetización - Toma de Foto</h2> */}
          {errorCamara && (
            <div className="error-message">
              <p>Error: {errorCamara}</p>
              <p>Por favor verifica que has dado permisos para usar la cámara.</p>
            </div>
          )}
          {/* {!mostrarCamara && !foto && (
            <button onClick={activarCamara} className="btn-activar-camara">
              Activar Cámara
            </button>
          )} */}
          {/* Resto del JSX... */}
          {mostrarCamara && (
            <div className="camara-preview">
              <video ref={videoRef} autoPlay playsInline className="video-camara" width="300px" />
              {/* <button onClick={tomarFoto} className="btn-tomar-foto">
                Tomar Foto
              </button>
              <button onClick={detenerCamara} className="btn-cancelar">
                Cancelar
              </button> */}
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          )}
          {foto && !mostrarCamara && (
            <div className="foto-preview">
              <img src={foto} alt="Foto tomada" className="imagen-preview" width="300px" />
              {/* <div className="botones-accion">
                <button onClick={guardarFoto} className="btn-guardar">
                  Guardar Foto
                </button>
                <button onClick={() => setFoto(null)} className="btn-reintentar">
                  Volver a tomar
                </button>
              </div> */}
            </div>
          )}
        </div>
      </MDBox>
      <MDBox
        position="absolute"
        display="flex"
        top={0}
        left={0}
        width="100%"
        height="100%"
        opacity={0.2}
        sx={{
          backgroundImage: `url(${pattern})`,
          backgroundSize: "cover",
        }}
      />
      <MDBox display="flex" zIndex={2} p={2} justifyContent="end" alignItems="center">
        {!mostrarCamara && !foto && (
          <MDButton variant="gradient" color="dark" onClick={activarCamara}>
            <Icon sx={{ fontWeight: "bold" }}>camera</Icon>
            &nbsp;Activar Camara
          </MDButton>
        )}
        {foto && !mostrarCamara && (
          <>
            <MDButton variant="gradient" color="dark" onClick={guardarFoto}>
              <Icon sx={{ fontWeight: "bold" }}>camera</Icon>
              &nbsp;Guardar Foto
            </MDButton>
            <MDButton variant="gradient" color="dark" onClick={() => setFoto(null)}>
              <Icon sx={{ fontWeight: "bold" }}>stop</Icon>
              &nbsp;Tomar de Nuevo
            </MDButton>
            {/* <MDButton variant="gradient" color="dark" onClick={handlePrint}>
              <Icon sx={{ fontWeight: "bold" }}>print</Icon>
              &nbsp;Imprimir
            </MDButton> */}
          </>
        )}
        {mostrarCamara && (
          <>
            <MDButton variant="gradient" color="dark" onClick={tomarFoto}>
              <Icon sx={{ fontWeight: "bold" }}>camera</Icon>
              &nbsp;Tomar Foto
            </MDButton>
            <MDButton variant="gradient" color="dark" onClick={detenerCamara}>
              <Icon sx={{ fontWeight: "bold" }}>cancel</Icon>
              &nbsp;Cancelar
            </MDButton>
          </>
        )}
        {/* <CarnetImpresion ref={componentRef} empleado={empleado} colorger={colorger.color} /> */}
        &nbsp;
        <MDButton variant="gradient" color="dark" onClick={generatePDF}>
          <Icon sx={{ fontWeight: "bold" }}>print</Icon>
          &nbsp;Imprimir
        </MDButton>
        &nbsp;&nbsp;
        <MDButton variant="gradient" color="dark" onClick={buscarEmpleado}>
          <Icon sx={{ fontWeight: "bold" }}>search</Icon>
          &nbsp;Buscar Empleado
        </MDButton>
        &nbsp;&nbsp;
        <MDInput
          label="Buscar Trabajador"
          value={ced}
          onChange={(e) => setCed(e.target.value)}
          keyboardType="numeric"
        />
      </MDBox>
      <MDBox position="relative" zIndex={2} p={2}>
        <MDBox display="flex" justifyContent="center" alignItems="center">
          <CarnetImprimible
            empleado={empleado}
            foto={processedFoto || foto || people}
            colorger={colorger}
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of MasterCard
Carnet.defaultProps = {
  color: "dark",
};

// Typechecking props for the MasterCard
Carnet.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  number: PropTypes.number.isRequired,
  holder: PropTypes.string.isRequired,
  expires: PropTypes.string.isRequired,
  empleado: PropTypes.shape({
    denger: PropTypes.string,
    nomper: PropTypes.string.isRequired,
    apeper: PropTypes.string.isRequired,
    cedper: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    carantper: PropTypes.string,
    codger: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // Agrega aquí cualquier otra propiedad que tenga el objeto empleado
  }),
  colorger: PropTypes.shape({
    color: PropTypes.string,
  }),
  foto: PropTypes.string, // Para la URL/base64 de la foto
  error: PropTypes.string,
  loading: PropTypes.bool,
};

export default Carnet;
