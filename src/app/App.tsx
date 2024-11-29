import { Header } from '@/common/components/Header/Header';
import { Loader } from '@/common/components/Loader/Loader';
import { MessagePopup } from '@/common/components/MessagePopup/MessagePopup';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export const App = () => {
    const [meRequestIsFinished, setMeRequestIsFinished] =
        useState<boolean>(true);
    // MessagePopup для ошибки серверной валидации
    return meRequestIsFinished ?
            <section>
                <Header />
                <Outlet />
                <MessagePopup />
            </section>
        :   <Loader />;
};
