import { Navigate } from 'react-router-dom';
import { LoginForm } from './LoginForm/LoginForm';
import { Title } from './Title/Title';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { selectIsLoggedIn } from '../../model/authSlice';
import { Container } from '@/common/components/Container/Container';
import { PATH } from '@/app/router/routerConfig';

export const LoginPage = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    if (isLoggedIn) {
        return <Navigate to={PATH.root} replace />;
    }

    return (
        <Container sx={{ display: 'grid', justifyContent: 'center' }}>
            <Title />
            <LoginForm />
        </Container>
    );
};
