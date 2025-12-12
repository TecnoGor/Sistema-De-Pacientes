// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import Pacientes from "layouts/pacientes";
import Consultas from "layouts/consultas";
import Citas from "layouts/citas";
import Especialistas from "layouts/especialistas";
import Users from "layouts/usuarios";
import Roles from "layouts/roles";
// import SignIn from "layouts/authentication/sign-in";
// import SignUp from "layouts/authentication/sign-up";

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
  },
  {
    type: "collapse",
    name: "Pacientes",
    key: "pacientes",
    icon: <Icon fontSize="small">personalinjury</Icon>,
    route: "/pacientes",
    component: <Pacientes />,
  },
  {
    type: "collapse",
    name: "Consultas Médicas",
    key: "consultas",
    icon: <Icon fontSize="small">medication</Icon>,
    route: "/consultas",
    component: <Consultas />,
  },
  {
    type: "collapse",
    name: "Atención Médica",
    key: "citas",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/citas",
    component: <Citas />,
  },
  {
    type: "collapse",
    name: "Personal Médico",
    key: "especialistas",
    icon: <Icon fontSize="small">masks</Icon>,
    route: "/especialistas",
    component: <Especialistas />,
  },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  {
    type: "collapse",
    name: "Notificaciones",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Perfil",
    key: "profile",
    icon: <Icon fontSize="small">accessibility</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "users",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/usuarios",
    component: <Users />,
  },
  {
    type: "collapse",
    name: "Roles y Funciones",
    key: "roles",
    icon: <Icon fontSize="small">gamepad</Icon>,
    route: "/roles",
    component: <Roles />,
  },
  // {
  //   type: "collapse",
  //   name: "Registrarte",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
];

export default routes;
