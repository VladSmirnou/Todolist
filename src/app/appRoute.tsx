import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { LoginPage } from '@/features/auth/ui/LoginPage/LoginPage';
import { Main } from './Main';
import { ProtectedRoute } from './ProtectedRoute';
import { SingleTaskPage } from '@/common/components/SingleTaskPage/SingleTaskPage';
import { EditTaskForm } from '@/common/components/EditTaskForm/EditTaskForm';

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
                    {
                        path: 'tasks/:taskId',
                        element: <SingleTaskPage />,
                    },
                    {
                        path: 'update/:taskId',
                        element: <EditTaskForm />,
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
