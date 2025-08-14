// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthContext';
import Style from './ProtectedRoute.module.css';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, authChecked, userRole } = useAuth();

  if (!authChecked) {
    return (
      <div className={Style.container}>
        <div className={Style.loader}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Esperar a que userRole esté disponible
  if (allowedRoles && userRole === null) {
    return (
      <div className={Style.container}>
        <div className={Style.loader}></div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/Inicio" replace />;
  }

  // Renderiza los hijos si se pasan, de lo contrario, el Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
