import { CicrularLoader } from '@/common/components/CircularProgress/CircularProgress';
import { Header } from '@/common/components/Header/Header';
import { MessagePopup } from '@/common/components/MessagePopup/MessagePopup';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useMeQuery } from '@/features/api/authApi';
import { setIsLoggedIn } from '@/features/auth/model/authSlice';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export const App = () => {
    const { data, isLoading } = useMeQuery();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (data !== undefined) {
            dispatch(setIsLoggedIn(data));
        }
    }, [dispatch, data]);

    return !isLoading ?
            <>
                <CssBaseline />
                <Header />
                <Outlet />
                <MessagePopup />
            </>
        :   <CicrularLoader />;
};
