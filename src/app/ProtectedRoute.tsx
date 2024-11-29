import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const isLoggedIn = true;
    return isLoggedIn ? <Outlet /> : <Navigate to={'/login'} />;
};
