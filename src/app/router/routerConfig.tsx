import { EditTaskForm } from '@/common/components/EditTaskForm/EditTaskForm';
import { SingleTaskPage } from '@/common/components/SingleTaskPage/SingleTaskPage';
import { RouteObject } from 'react-router-dom';
import { Main } from '../Main';
import { LoginPage } from '@/features/auth/ui/LoginPage/LoginPage';

export const PATH = {
    root: '/',
    singleTask: 'tasks/:taskId',
    updateTask: 'update/:taskId',
    login: '/login',
};

export const publicRoutes: Array<RouteObject> = [
    {
        path: PATH.login,
        element: <LoginPage />,
    },
];

export const privateRoutes: Array<RouteObject> = [
    {
        index: true,
        element: <Main />,
    },
    {
        path: PATH.singleTask,
        element: <SingleTaskPage />,
    },
    {
        path: PATH.updateTask,
        element: <EditTaskForm />,
    },
];
