import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export const LinearLoader = () => {
    return (
        <Box sx={{ width: '100%', position: 'absolute', bottom: 0 }}>
            <LinearProgress />
        </Box>
    );
};
