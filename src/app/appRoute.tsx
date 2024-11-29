import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { LoginPage } from '@/features/auth/ui/LoginPage/LoginPage';
import { Main } from './Main';
import { ProtectedRoute } from './ProtectedRoute';

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Main />,
                    },
                ],
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },
]);
