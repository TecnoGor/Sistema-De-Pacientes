import PropTypes from "prop-types";
import React from "react";
import CarnetQR from "components/MDQr";
import bgImage from "assets/images/carnetDesign/CARNET-01.png";
import logoIpos from "assets/images/ipostel.png";
import logoHeader from "assets/images/carnetDesign/Logos_Ipostel-04.png";
import logoHeader2 from "assets/images/carnetDesign/Logos_Ipostel-03.png";
import banner from "assets/images/carnetDesign/CARNET-06.png";
import bandera from "assets/images/carnetDesign/CARNET-03.png";
import people from "assets/images/John_doe.jpg";

const CarnetImprimible = React.forwardRef(({ empleado, foto, colorger }, ref) => (
  <div style={{ flexDirection: "row", display: "flex" }}>
    <div style={{ margin: "10px" }}>
      <div
        id="carnetImprimible"
        ref={ref}
        style={{
          display: "flex",
          width: "5.5cm",
          height: "8.5cm",
          justifyContent: "center",
          background: "white",
          flexDirection: "column",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "18%",
            background: "transparent",
            marginLeft: 0,
            padding: 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            className="flagLeft"
            style={{
              width: "34%",
              height: "7cm",
              position: "absolute",
              zIndex: 30,
              marginLeft: -25,
              marginTop: -10,
              borderRadius: 20,
              background: colorger.color || "green",
              transform: "translateZ(1px)",
            }}
          >
            {empleado && (
              <p
                style={{
                  position: "absolute",
                  color: "#000",
                  zIndex: 30,
                  transform: "rotate(-90deg)",
                  width: "7cm",
                  fontSize: 12,
                  textAlign: "center",
                  fontWeight: "bold",
                  marginLeft: -85,
                  marginTop: 120,
                }}
              >
                {empleado.desuniadm}
              </p>
            )}
          </div>
          <div style={{ position: "relative", width: "25%" }}></div>
          <img
            src={logoHeader}
            alt="logo"
            style={{
              width: "35%",
              height: "90%",
            }}
          />
          <img
            src={logoHeader2}
            alt="logo"
            style={{
              width: "35%",
              height: "80%",
            }}
          />
        </div>
        <div
          style={{
            display: "relative",
            width: "100%",
            height: "60%",
            padding: 0,
            background: "transparent",
            opacity: 1,
            marginRight: 0,
          }}
        >
          <div style={{ display: "relative", width: "30%" }}></div>
          <div
            style={{
              display: "relative",
              width: "70%",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 15,
            }}
          >
            <img
              src={bandera}
              alt="bandera"
              style={{
                width: "5cm",
                height: "2.2cm",
                marginTop: -45,
                marginLeft: 20,
              }}
            />
            <img
              src={foto || people}
              alt="people"
              style={{
                width: "2.7cm",
                height: "3cm",
                marginTop: -40,
                marginLeft: 77,
                padding: 10,
                borderRadius: 2,
                objectFit: "cover",
                objectPosition: "center",
                backgroundSize: "cover",
              }}
            />
            {empleado && (
              <>
                <p
                  style={{
                    width: "100%",
                    color: "black",
                    fontWeight: "bold",
                    marginTop: -20,
                    marginLeft: 55,
                    textAlign: "center",
                    fontSize: 10,
                  }}
                >
                  {empleado.nomper}
                  <br />
                  {empleado.apeper}
                </p>
                <p
                  style={{
                    width: "100%",
                    color: "black",
                    fontWeight: "bold",
                    marginTop: -1,
                    marginLeft: 102,
                    fontSize: 12,
                  }}
                >
                  {empleado.cedper}
                </p>
                <p
                  style={{
                    width: "8cm",
                    color: "black",
                    fontWeight: "bold",
                    padding: 4,
                    marginTop: 0,
                    marginLeft: -25,
                    textAlign: "center",
                    background: "#888",
                    fontSize: 10,
                  }}
                >
                  {empleado.descar}
                </p>
              </>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "22%",
            justifyContent: "center",
            alignItems: "center",
            background: "transparent",
          }}
        >
          <div
            alt="QREmpleado"
            style={{
              width: "3cm",
              marginTop: 15,
            }}
          >
            {empleado && <CarnetQR empleadoId={empleado.cedper}></CarnetQR>}
          </div>
          <img
            src={logoIpos}
            alt="logoIpos"
            style={{
              width: "3.5cm",
              marginTop: 0,
              marginLeft: -50,
            }}
          />
        </div>
      </div>
    </div>
    <div style={{ margin: "10px" }}>
      <div
        id="carnetImprimible2"
        style={{
          display: "flex",
          width: "5.5cm",
          height: "8.5cm",
          justifyContent: "center",
          background: "white",
          flexDirection: "column",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          transformStyle: "preserve-3d",
          textAlign: "justify",
          fontSize: 9,
          padding: 10,
          paddingTop: 30,
        }}
      >
        <p>1. Este carnet es de uso personal e intransferible, no implica autoridad alguna.</p>
        <p>2. Debe portarse en un lugar visible.</p>
        <p>
          3. La institución no se hace responsable de las acciones ejecutadas por el portador de
          esta identificación. Solo responde de las acciones en el desempeño de sus funciones.
        </p>
        <p>
          4. Esta identificación es de IPOSTEL y debe ser entregado a la Dirección de Seguridad
          Postal al finalizar la relación laboral.
        </p>
        <p>5. En caso de extravio, favor notificarlo al teléfono: (0212) 405.32.19.</p>
        <div style={{ textAlign: "center", marginTop: 90 }}>
          <p> Centro Postal de Caracas </p>
          <p> Caracas - Venezuela. Zp. 1020 </p>
        </div>
      </div>
    </div>
  </div>
));

CarnetImprimible.propTypes = {
  empleado: PropTypes.shape({
    nomper: PropTypes.string.isRequired,
    apeper: PropTypes.string.isRequired,
    cedper: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    desuniadm: PropTypes.string,
    descar: PropTypes.string,
  }),
  foto: PropTypes.string, // Si `foto` es una URL/base64
  colorger: PropTypes.shape({
    color: PropTypes.string,
  }),
};

export default CarnetImprimible;
