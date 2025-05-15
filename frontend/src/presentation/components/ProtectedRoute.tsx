import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  allowedCollections: ('register' | 'admin' | 'user' | 'faculty')[];
  isPublic?: boolean;
}

export const ProtectedRoute = ({ allowedCollections, isPublic = false }: ProtectedRouteProps) => {
  const { token, collection } = useSelector((state: RootState) => state.auth);

  if (!token && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  if (isPublic) {
    return <Outlet />;
  }

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
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />; // ✅ Fix: Render children routes through Outlet
};
