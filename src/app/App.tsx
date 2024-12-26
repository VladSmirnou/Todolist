import { CicrularLoader } from '@/common/components/CircularProgress/CircularProgress';
import { Header } from '@/common/components/Header/Header';
import { MessagePopup } from '@/common/components/MessagePopup/MessagePopup';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useMeQuery } from '@/features/api/authApi';
import { setIsLoggedIn } from '@/features/auth/model/authSlice';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const App = () => {
    const { data: isUserHasToken } = useMeQuery();
    const dispatch = useAppDispatch();

    const [meRequestIsFinished, setMeRequestIsFinished] = useState(false);

    useEffect(() => {
        if (isUserHasToken !== undefined) {
            dispatch(setIsLoggedIn(isUserHasToken));
            setMeRequestIsFinished(true);
        }
    }, [dispatch, isUserHasToken]);

    return meRequestIsFinished ?
            <>
                <CssBaseline />
                <Header />
                <Outlet />
                <MessagePopup />
            </>
        :   <CicrularLoader />;
};
