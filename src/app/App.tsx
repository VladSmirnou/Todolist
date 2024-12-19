import { CicrularLoader } from '@/common/components/CircularProgress/CircularProgress';
import { Header } from '@/common/components/Header/Header';
import { MessagePopup } from '@/common/components/MessagePopup/MessagePopup';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { me } from '@/features/auth/model/authSlice';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

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
        :   <CicrularLoader />;
};
