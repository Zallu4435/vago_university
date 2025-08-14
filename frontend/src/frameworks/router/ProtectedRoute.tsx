import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../appStore/store';

interface ProtectedRouteProps {
  allowedCollections: ('register' | 'admin' | 'user' | 'faculty')[];
  isPublic?: boolean;
}

export const ProtectedRoute = ({ allowedCollections, isPublic = false }: ProtectedRouteProps) => {
  const { isAuthenticated, collection } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    switch (collection) {
      case 'register':
        return <Navigate to="/admission" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'user':
        return <Navigate to="/dashboard" replace />;
      case 'faculty':
        return <Navigate to="/faculty/" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  if (!isAuthenticated && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  if (isPublic) {
    if (isAuthenticated && collection === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Outlet />;
  }

  // Handle protected routes
  if (isAuthenticated && collection && !allowedCollections.includes(collection)) {
    switch (collection) {
      case 'register':
        return <Navigate to="/admission" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'user':
        return <Navigate to="/dashboard" replace />;
      case 'faculty':
        return <Navigate to="/faculty/" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};