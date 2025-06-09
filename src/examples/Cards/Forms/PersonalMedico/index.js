import React from "react";
import PropTypes from "prop-types";
import EnfermeroForm from "./Enfermero";
import MedicoForm from "./Medico";
import TecnicoForm from "./Tecnico";

function PersonalMedico({ personal }) {
  switch (personal) {
    case 1:
      return <MedicoForm />;
    case 2:
      return <TecnicoForm />;
    case 3:
      return <EnfermeroForm />;
    default:
      return null;
  }
}

PersonalMedico.defaultProps = {
  personal: 0,
};

PersonalMedico.propTypes = {
  personal: PropTypes.number.isRequired,
};

export default PersonalMedico;
