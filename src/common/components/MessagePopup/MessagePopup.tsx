import { selectAppStatus, selectAppStatusText } from '@/app/appSlice';
import { AppStatus } from '@/common/enums/enums';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { dispatchAppStatusData } from '@/common/utils/dispatchAppStatusData';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

export const MessagePopup = () => {
    const appStatus = useAppSelector(selectAppStatus);
    const appStatusText = useAppSelector(selectAppStatusText);
    const dispatch = useAppDispatch();

    const open =
        appStatus === AppStatus.FAILED || appStatus === AppStatus.SUCCEEDED;

    if (!open) {
        return;
    }

    const handleClose = (
        _: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        // X button pressed -> reason === undefined
        // presed somewhere outside the snackbar -> reason === 'clickaway'
        // timeout -> reason === 'timeout'
        if (reason === 'clickaway') {
            return;
        }
        dispatchAppStatusData(dispatch, AppStatus.IDLE, '');
    };

    return (
        <div>
            <Snackbar
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
            >
                <Alert
                    onClose={handleClose}
                    severity={
                        appStatus === AppStatus.FAILED ? 'error' : 'success'
                    }
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {appStatusText}
                </Alert>
            </Snackbar>
        </div>
    );
};
