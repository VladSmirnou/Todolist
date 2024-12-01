import { Navigate } from 'react-router-dom';
import { LoginForm } from './LoginForm/LoginForm';
import { Title } from './Title/Title';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { selectIsLoggedIn } from '../../model/authSlice';

export const LoginPage = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    if (isLoggedIn) {
        return <Navigate to={'/'} />;
    }

    return (
        <section>
            <Title />
            <LoginForm />
        </section>
    );
};
