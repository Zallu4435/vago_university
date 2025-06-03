import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  allowedCollections: ('register' | 'admin' | 'user' | 'faculty')[];
  isPublic?: boolean;
}

export const ProtectedRoute = ({ allowedCollections, isPublic = false }: ProtectedRouteProps) => {
  const { token, collection } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (token && (location.pathname === '/login' || location.pathname === '/register')) {
    switch (collection) {
      case 'register':
        return <Navigate to="/admission" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'user':
        return <Navigate to="/dashboard" replace />;
      case 'faculty':
        return <Navigate to="/faculty/courses" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  if (!token && !isPublic) {
    return <Navigate to="/register" replace />;
  }

  if (isPublic) {
    if (token && collection === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Outlet />;
  }

  // Handle protected routes
  if (token && collection && !allowedCollections.includes(collection)) {
    switch (collection) {
      case 'register':
        return <Navigate to="/admission" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'user':
        return <Navigate to="/dashboard" replace />;
      case 'faculty':
        return <Navigate to="/faculty/courses" replace />;
      default:
        return <Navigate to="/register" replace />;
    }
  }

  return <Outlet />;
};