import { selectAppStatus } from '@/app/appSlice';
import { AUTH_TOKEN_KEY } from '@/common/constants/constants';
import { AppStatus } from '@/common/enums/enums';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { useLogoutMutation } from '@/features/api/authApi';
import { baseApi } from '@/features/api/baseApi';
import {
    selectIsLoggedIn,
    setIsLoggedIn,
} from '@/features/auth/model/authSlice';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { LinearLoader } from '../LinearProgress/LinerProgress';

export const Header = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const appStatus = useAppSelector(selectAppStatus);
    const [logout] = useLogoutMutation();

    const handleLogout = () => {
        logout()
            .unwrap()
            .then(() => {
                dispatch(setIsLoggedIn(false));
                localStorage.removeItem(AUTH_TOKEN_KEY);
                // Лишняя микротаска позволит компонентам перерисоваться
                // и после инвалидации тэгов у кэша не будет подписчиков,
                // поэтому повторные запросы не отправятся, а кэш тасок и тудулистов
                // просто удалится.
            })
            .then(() => {
                dispatch(baseApi.util.invalidateTags(['Todolists', 'Tasks']));
            });
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {isLoggedIn && (
                        <Button onClick={handleLogout} color="inherit">
                            Logout
                        </Button>
                    )}
                </Toolbar>
                {appStatus === AppStatus.PENDING && <LinearLoader />}
            </AppBar>
        </Box>
    );
};
