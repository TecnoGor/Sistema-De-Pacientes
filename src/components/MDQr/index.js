import React from "react";
import { QRCodeSVG } from "qrcode.react";
import PropTypes from "prop-types";
// import { MDBox } from "components/MDBox";

const CarnetQR = ({ empleadoId }) => {
  if (!empleadoId) return null;

  const qrValue = `http://tudominio.com/api/empleado/qr/${empleadoId}`;

  return (
    <div style={{ padding: "0", display: "absolute", justifyContent: "center" }}>
      <QRCodeSVG value={qrValue} size={60} level="H" includeMargin={true} />
    </div>
  );
};

CarnetQR.propTypes = {
  empleadoId: PropTypes.oneOfType([
    PropTypes.string, // Acepta string
    PropTypes.number, // o número
  ]).isRequired, // y es obligatorio
};

export default CarnetQR;
