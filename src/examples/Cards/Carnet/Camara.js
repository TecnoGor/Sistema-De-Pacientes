import { useState, useRef, useEffect } from "react";

const CamaraCarnetizacion = () => {
  const [foto, setFoto] = useState(null);
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [errorCamara, setErrorCamara] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Limpiar la cámara al desmontar el componente
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
  // Resto del código (tomarFoto, detenerCamara, guardarFoto) permanece igual...
  return (
    <div className="container-camara">
      <h2>Sistema de Carnetización - Toma de Foto</h2>
      {errorCamara && (
        <div className="error-message">
          <p>Error: {errorCamara}</p>
          <p>Por favor verifica que has dado permisos para usar la cámara.</p>
        </div>
      )}
      {!mostrarCamara && !foto && (
        <button onClick={activarCamara} className="btn-activar-camara">
          Activar Cámara
        </button>
      )}
      {/* Resto del JSX... */}
      {mostrarCamara && (
        <div className="camara-preview">
          <video ref={videoRef} autoPlay playsInline className="video-camara" width="300px" />
          <button onClick={tomarFoto} className="btn-tomar-foto">
            Tomar Foto
          </button>
          <button onClick={detenerCamara} className="btn-cancelar">
            Cancelar
          </button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}
      {foto && !mostrarCamara && (
        <div className="foto-preview">
          <img src={foto} alt="Foto tomada" className="imagen-preview" width="300px" />
          <div className="botones-accion">
            <button onClick={guardarFoto} className="btn-guardar">
              Guardar Foto
            </button>
            <button onClick={() => setFoto(null)} className="btn-reintentar">
              Volver a tomar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CamaraCarnetizacion;
