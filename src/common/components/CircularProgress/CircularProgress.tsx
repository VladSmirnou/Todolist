import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const CicrularLoader = () => {
    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CircularProgress size={'100px'} />
        </Box>
    );
};
