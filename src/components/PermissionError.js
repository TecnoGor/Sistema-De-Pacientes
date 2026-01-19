import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";

const PermissionError = ({ requiredPermission, missingPermissions = [], moduleName = "" }) => {
  return (
    <MDBox display="flex" justifyContent="center" alignItems="center" height="80vh">
      <Card sx={{ p: 4, maxWidth: 500, textAlign: "center" }}>
        <MDBox mb={3}>
          <Icon fontSize="large" color="error">
            warning
          </Icon>
        </MDBox>
        <MDTypography variant="h5" color="error" gutterBottom>
          Acceso Denegado
        </MDTypography>
        <MDTypography variant="body2" color="textSecondary" paragraph>
          No tienes los permisos necesarios para acceder a {moduleName || "este módulo"}.
        </MDTypography>

        {requiredPermission && (
          <MDBox mt={2}>
            <MDTypography variant="body2" fontWeight="bold">
              Permiso requerido:
            </MDTypography>
            <MDTypography variant="body2" color="textSecondary">
              {requiredPermission}
            </MDTypography>
          </MDBox>
        )}

        {missingPermissions.length > 0 && (
          <MDBox mt={2}>
            <MDTypography variant="body2" fontWeight="bold">
              Permisos faltantes:
            </MDTypography>
            <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
              {missingPermissions.map((perm, index) => (
                <li key={index}>
                  <MDTypography variant="body2" color="textSecondary">
                    {perm}
                  </MDTypography>
                </li>
              ))}
            </ul>
          </MDBox>
        )}

        <MDBox mt={3}>
          <MDButton variant="gradient" color="info" onClick={() => window.history.back()}>
            <Icon>arrow_back</Icon>
            &nbsp;Volver
          </MDButton>
          &nbsp;
          <MDButton
            variant="outlined"
            color="info"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <Icon>dashboard</Icon>
            &nbsp;Ir al Dashboard
          </MDButton>
        </MDBox>
      </Card>
    </MDBox>
  );
};

PermissionError.propTypes = {
  requiredPermission: PropTypes.string,
  missingPermissions: PropTypes.arrayOf(PropTypes.string),
  moduleName: PropTypes.string,
};

PermissionError.defaultProps = {
  requiredPermission: "",
  missingPermissions: [],
  moduleName: "",
};

export default PermissionError;
