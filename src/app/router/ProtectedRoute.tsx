import { useAppSelector } from '@/common/hooks/useAppSelector';
import { selectIsLoggedIn } from '@/features/auth/model/authSlice';
import { Navigate, Outlet } from 'react-router-dom';
import { PATH } from './routerConfig';

export const ProtectedRoute = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    return isLoggedIn ? <Outlet /> : <Navigate to={PATH.login} replace />;
};
