import { Navigate } from 'react-router-dom';
import { LoginForm } from './LoginForm/LoginForm';
import { Title } from './Title/Title';

export const LoginPage = () => {
    const isLoggedIn = true;

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
