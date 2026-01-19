// utils/themeUtils.js

// Funciones por defecto para Material Dashboard
const defaultFunctions = {
  linearGradient: (color, colorState, angle = 195) =>
    `linear-gradient(${angle}deg, ${color}, ${colorState})`,
  pxToRem: (px) => `${px / 16}rem`,
  boxShadow: (offset = [0, 0], radius = 0, color = "#000", opacity = 0, inset = "") => {
    return `${inset} ${offset[0]}px ${offset[1]}px ${radius}px ${color}${
      opacity ? ` ${opacity}` : ""
    }`;
  },
  rgba: (color, opacity) => {
    // Implementación simple para colores hexadecimales
    if (color.startsWith("#") && color.length === 7) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },
  hexToRgb: (color) => {
    if (color.startsWith("#") && color.length === 7) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    }
    return color;
  },
};

// Gradientes por defecto
const defaultGradients = {
  primary: { main: "#EC407A", state: "#D81B60" },
  secondary: { main: "#747b8a", state: "#495361" },
  info: { main: "#49a3f1", state: "#1A73E8" },
  success: { main: "#66BB6A", state: "#43A047" },
  warning: { main: "#FFA726", state: "#FB8C00" },
  error: { main: "#EF5350", state: "#E53935" },
  light: { main: "#EBEFF4", state: "#CED4DA" },
  dark: { main: "#42424a", state: "#191919" },
};

// Asegurar que un tema tenga todas las propiedades necesarias
export const ensureThemeFunctions = (theme) => {
  if (!theme) {
    // Devolver un tema mínimo si no hay tema
    return {
      palette: { gradients: defaultGradients },
      functions: defaultFunctions,
      borders: { borderRadius: { md: "0.375rem" } },
      boxShadows: {},
    };
  }

  // Crear una copia segura del tema
  const safeTheme = JSON.parse(JSON.stringify(theme));

  // Asegurar funciones
  if (!safeTheme.functions) {
    safeTheme.functions = { ...defaultFunctions };
  } else {
    // Completar funciones faltantes
    Object.keys(defaultFunctions).forEach((key) => {
      if (!safeTheme.functions[key]) {
        safeTheme.functions[key] = defaultFunctions[key];
      }
    });
  }

  // Asegurar gradientes
  if (!safeTheme.palette) safeTheme.palette = {};
  if (!safeTheme.palette.gradients) {
    safeTheme.palette.gradients = defaultGradients;
  } else {
    // Completar gradientes faltantes
    Object.keys(defaultGradients).forEach((key) => {
      if (!safeTheme.palette.gradients[key]) {
        safeTheme.palette.gradients[key] = defaultGradients[key];
      }
    });
  }

  // Asegurar otras propiedades
  if (!safeTheme.borders) safeTheme.borders = { borderRadius: { md: "0.375rem" } };
  if (!safeTheme.boxShadows) safeTheme.boxShadows = {};

  return safeTheme;
};

export default { ensureThemeFunctions, defaultFunctions, defaultGradients };
