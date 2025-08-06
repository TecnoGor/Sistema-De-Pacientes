import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import dashboardRoutes from "routes";

function ProtectedLayout() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar logout={logout} />
      <Routes>
        {dashboardRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.component}
          />
        ))}
      </Routes>
      <Footer />
    </DashboardLayout>
  );
}

export default ProtectedLayout;