import type { AppDispatch } from '@/app/store';
import { AUTH_TOKEN_KEY } from '@/common/constants/constants';
import { AppStatus, ResultCode } from '@/common/enums/enums';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import type { LoginFormData, Response } from '@/common/types/types';
import { dispatchAppStatusData } from '@/common/utils/dispatchAppStatusData';
import { handleReduxQueryError } from '@/common/utils/handleReduxQueryError';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { setIsLoggedIn } from '@/features/auth/model/authSlice';
import { FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SubmitHandler, useForm, UseFormSetError } from 'react-hook-form';
import s from './LoginForm.module.css';

const defaultValues = {
    email: '',
    password: '',
    rememberMe: false,
};

const required = {
    value: true,
    message: 'This field is required',
};

const handleLoginFulfilled = (
    result: Response<{
        token: string;
        userId: number;
    }>,
    dispatch: AppDispatch,
    setError: UseFormSetError<LoginFormData>,
) => {
    if (result.resultCode !== ResultCode.Success) {
        if (result.fieldsErrors.length) {
            // Насколько я понял, в Redux Query просто нету альтернативы
            // rejectWithValue, поэтому я просто не могу вернуть
            // result.fieldsErrors в хэндлер. Query оборачивает тригеры,
            // и я больше не могу вернуть значение из middleware или
            // enchancer-a над dispatch напрямую, оно просто игнорируется.
            result.fieldsErrors.forEach(({ field, error }) => {
                setError(field as keyof LoginFormData, {
                    type: 'custom',
                    message: error,
                });
            });
        } else {
            const errorMessage = result.messages[0];
            dispatchAppStatusData(dispatch, AppStatus.FAILED, errorMessage);
        }
        return false;
    } else {
        localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
        dispatch(setIsLoggedIn(true));
        return true;
    }
};

export const LoginForm = () => {
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        setError,
        reset,
    } = useForm<LoginFormData>({ defaultValues });

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        try {
            const result = await login(data).unwrap();
            const noServerError = handleLoginFulfilled(
                result,
                dispatch,
                setError,
            );
            if (noServerError) {
                reset();
            }
        } catch (e) {
            handleReduxQueryError(
                dispatch,
                e as FetchBaseQueryError | SerializedError,
            );
        }
    };

    return (
        <FormControl>
            <Box
                onSubmit={handleSubmit(onSubmit)}
                component="form"
                className={s.form}
                noValidate
                autoComplete="off"
            >
                <TextField
                    disabled={isLoading}
                    error={!!errors.email}
                    id="email"
                    label="Email"
                    helperText={errors.email && errors.email.message}
                    {...register('email', { required })}
                />
                <TextField
                    disabled={isLoading}
                    error={!!errors.password}
                    type="password"
                    id="password"
                    label="Password"
                    helperText={errors.password && errors.password.message}
                    {...register('password', {
                        required,
                        minLength: {
                            value: 4,
                            message:
                                'Password field must be at least 4 characters long',
                        },
                    })}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            disabled={isLoading}
                            {...register('rememberMe')}
                        />
                    }
                    label="Remember me"
                />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={!isDirty || !isValid || isLoading}
                >
                    Login
                </Button>
            </Box>
        </FormControl>
    );
};
