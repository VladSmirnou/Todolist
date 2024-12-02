import {
    appStatusChanged,
    appStatusTextSet,
    selectAppStatus,
    selectAppStatusText,
} from '@/app/appSlice';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';

export const MessagePopup = () => {
    const appStatus = useAppSelector(selectAppStatus);
    const appStatusText = useAppSelector(selectAppStatusText);
    const dispatch = useAppDispatch();

    let content;

    if (appStatus === 'failed') {
        content = (
            <div>
                <p style={{ color: 'red' }}>{appStatusText}</p>
            </div>
        );
    }

    if (appStatus === 'succeeded') {
        content = (
            <div>
                <p style={{ color: 'green' }}>{appStatusText}</p>
            </div>
        );
    }

    setTimeout(() => {
        dispatch(appStatusChanged('idle'));
        dispatch(appStatusTextSet(''));
    }, 3000);

    return content;
};
