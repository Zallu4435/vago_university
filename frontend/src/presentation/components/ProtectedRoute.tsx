// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';
// // import { RootState } from '../redux/store';

// interface ProtectedRouteProps {
//     children: React.ReactNode;
//     allowedRoles: string[];
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, allowedRoles}) => {
//     const { user, token } = useSelector((state: RootState) => state.auth);

//     if (!user || !token) {
//         return <Navigate to='/login' replace />
//     }

//     if (!allowedRoles.includes(user.role)) {
//         return <Navigate to='/unauthorized' replace />
//     }

//     return <>{children}</>
// }

// export default ProtectedRoute;
