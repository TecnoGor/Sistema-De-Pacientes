import React from "react";
// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import Basic from "layouts/authentication/sign-in";
import Cover from "layouts/authentication/sign-up";
import Pacientes from "layouts/pacientes";
import Consultas from "layouts/consultas";
import Citas from "layouts/citas";
import Especialistas from "layouts/especialistas";
import Users from "layouts/usuarios";
import Roles from "layouts/roles";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    protected: true,
    requiredPermission: "view_dashboard",
  },
  {
    type: "collapse",
    name: "Pacientes",
    key: "pacientes",
    icon: <Icon fontSize="small">personalinjury</Icon>,
    route: "/pacientes",
    component: <Pacientes />,
    protected: true,
    requiredPermission: "view_pacientes",
  },
  {
    type: "collapse",
    name: "Consultas Médicas",
    key: "consultas",
    icon: <Icon fontSize="small">medication</Icon>,
    route: "/consultas",
    component: <Consultas />,
    protected: true,
    requiredPermission: "view_consultas",
  },
  {
    type: "collapse",
    name: "Atención Médica",
    key: "atenciones",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/atenciones",
    component: <Citas />,
    protected: true,
    requiredPermission: "view_citas",
  },
  {
    type: "collapse",
    name: "Personal Médico",
    key: "especialistas",
    icon: <Icon fontSize="small">masks</Icon>,
    route: "/especialistas",
    component: <Especialistas />,
    protected: true,
    requiredPermission: "view_especialistas",
  },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  //   protected: true
  // },
  // {
  //   type: "collapse",
  //   name: "Notificaciones",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  //   protected: true
  // },
  {
    type: "collapse",
    name: "Perfil",
    key: "profile",
    icon: <Icon fontSize="small">accessibility</Icon>,
    route: "/profile",
    component: <Profile />,
    protected: true,
    // No requiere permiso específico, todos los usuarios autenticados pueden ver su perfil
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "users",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/usuarios",
    component: <Users />,
    protected: true,
    requiredPermission: "view_usuarios",
  },
  {
    type: "collapse",
    name: "Roles y Funciones",
    key: "roles",
    icon: <Icon fontSize="small">gamepad</Icon>,
    route: "/roles",
    component: <Roles />,
    protected: true,
    requiredPermission: "view_roles",
  },
  // Rutas públicas (sin autenticación)
  {
    type: "collapse",
    name: "Iniciar Sesión",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <Basic />,
    protected: false,
    hideWhenUnauthenticated: true, // Ocultar cuando el usuario esté autenticado
  },
  {
    type: "collapse",
    name: "Registrarse",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <Cover />,
    protected: false,
    hideWhenUnauthenticated: true, // Ocultar cuando el usuario esté autenticado
  },
];

export default routes;
