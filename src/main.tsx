import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { appRouter } from './app/router/appRoute';
import { store } from './app/store';

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <RouterProvider router={appRouter} />
    </Provider>,
);
