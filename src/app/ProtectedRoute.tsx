import { useAppSelector } from '@/common/hooks/useAppSelector';
import { selectIsLoggedIn } from '@/features/auth/model/authSlice';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    return isLoggedIn ? <Outlet /> : <Navigate to={'/login'} replace />;
};
