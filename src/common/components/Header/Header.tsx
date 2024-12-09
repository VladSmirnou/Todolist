import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { logout, selectIsLoggedIn } from '@/features/auth/model/authSlice';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { LinearLoader } from '../LinearProgress/LinerProgress';
import { selectAppStatus } from '@/app/appSlice';

export const Header = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const appStatus = useAppSelector(selectAppStatus);

    const handleLogout = () => {
        dispatch(logout());
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
                {appStatus === 'pending' && <LinearLoader />}
            </AppBar>
        </Box>
    );
};

// export const Header = () => {
//     const dispatch = useAppDispatch();
//     const isLoggedIn = useAppSelector(selectIsLoggedIn);

//     const handleLogout = () => {
//         dispatch(logout());
//     };

//     return (
//         <header style={{ backgroundColor: 'green' }}>
//             {isLoggedIn && <button onClick={handleLogout}>logout</button>}
//         </header>
//     );
// };
