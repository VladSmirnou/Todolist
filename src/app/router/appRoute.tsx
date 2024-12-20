import { ErrorPage } from '@/common/components/ErrorPage/ErrorPage';
import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { ProtectedRoute } from './ProtectedRoute';
import { PATH, privateRoutes, publicRoutes } from './routerConfig';

export const appRouter = createBrowserRouter([
    {
        path: PATH.root,
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <ProtectedRoute />,
                children: privateRoutes,
            },
            ...publicRoutes,
        ],
    },
]);
