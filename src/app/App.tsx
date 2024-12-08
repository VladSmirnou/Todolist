import { Header } from '@/common/components/Header/Header';
import { Loader } from '@/common/components/Loader/Loader';
import { MessagePopup } from '@/common/components/MessagePopup/MessagePopup';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { me } from '@/features/auth/model/authSlice';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

export const App = () => {
    const dispatch = useAppDispatch();

    const [meRequestIsFinished, setMeRequestIsFinished] =
        useState<boolean>(false);

    useEffect(() => {
        dispatch(me()).finally(() => setMeRequestIsFinished(true));
    }, [dispatch]);

    return meRequestIsFinished ?
            <>
                <CssBaseline />
                <Header />
                <Outlet />
                <MessagePopup />
            </>
        :   <Loader />;
};
