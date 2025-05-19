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
  console.log('ProtectedRoute: token=', token, 'collection=', collection, 'path=', location.pathname);

  // Block /login and /register for logged-in users
  if (token && (location.pathname === '/login' || location.pathname === '/register')) {
    console.log('Logged-in user attempting to access /login or /register, redirecting');
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

  // Handle unauthenticated users
  if (!token && !isPublic) {
    console.log('No token for protected route, redirecting to /register');
    return <Navigate to="/register" replace />;
  }

  // Handle public routes
  if (isPublic) {
    // Admins should not access public routes
    if (token && collection === 'admin') {
      console.log('Admin attempting to access public route, redirecting to /admin');
      return <Navigate to="/admin" replace />;
    }
    console.log('Rendering public route');
    return <Outlet />;
  }

  // Handle protected routes
  if (token && collection && !allowedCollections.includes(collection)) {
    console.log(`Collection ${collection} not allowed for route, redirecting`);
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

  console.log('Rendering protected route');
  return <Outlet />;
};