import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { logout, selectIsLoggedIn } from '@/features/auth/model/authSlice';

export const Header = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header style={{ backgroundColor: 'green' }}>
            {isLoggedIn && <button onClick={handleLogout}>logout</button>}
        </header>
    );
};
