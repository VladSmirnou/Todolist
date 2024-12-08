import { Navigate } from 'react-router-dom';
import { LoginForm } from './LoginForm/LoginForm';
import { Title } from './Title/Title';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { selectIsLoggedIn } from '../../model/authSlice';
import { Container } from '@/common/components/Container/Container';

export const LoginPage = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    if (isLoggedIn) {
        return <Navigate to={'/'} replace />;
    }

    return (
        <Container sx={{ display: 'grid', justifyContent: 'center' }}>
            <Title />
            <LoginForm />
        </Container>
    );
};
