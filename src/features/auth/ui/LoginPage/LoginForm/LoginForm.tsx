import { appStatusChanged, selectAppStatus } from '@/app/appSlice';
import { AUTH_TOKEN_KEY } from '@/common/constants/constants';
import { AppStatus } from '@/common/enums/enums';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
import { LoginFormData } from '@/common/types/types';
import { setIsLoggedIn } from '@/features/auth/model/authSlice';
import { FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { SubmitHandler, useForm } from 'react-hook-form';
import s from './LoginForm.module.css';
import { useLoginMutation } from '@/features/api/authApi';

const defaultValues = {
    email: '',
    password: '',
    rememberMe: false,
};

const required = {
    value: true,
    message: 'This field is required',
};

export const LoginForm = () => {
    const dispatch = useAppDispatch();
    const appStatus = useAppSelector(selectAppStatus);
    const [login] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        setError,
    } = useForm<LoginFormData>({ defaultValues });

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        dispatch(appStatusChanged(AppStatus.PENDING));
        const result = await login(data).unwrap();
        localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
        dispatch(setIsLoggedIn(true));
        dispatch(appStatusChanged(AppStatus.IDLE));
        //     .unwrap()
        //     .catch(
        //         (
        //             err: Array<{
        //                 field: keyof LoginFormData;
        //                 error: string;
        //             }>,
        //         ) => {
        //             err.forEach(({ field, error }) => {
        //                 setError(field, { type: 'custom', message: error });
        //             });
        //         },
        //     );
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
                    disabled={appStatus === AppStatus.PENDING}
                    error={!!errors.email}
                    id="email"
                    label="Email"
                    helperText={errors.email && errors.email.message}
                    {...register('email', { required })}
                />
                <TextField
                    disabled={appStatus === AppStatus.PENDING}
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
                            disabled={appStatus === AppStatus.PENDING}
                            {...register('rememberMe')}
                        />
                    }
                    label="Remember me"
                />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={
                        !isDirty || !isValid || appStatus === AppStatus.PENDING
                    }
                >
                    Login
                </Button>
            </Box>
        </FormControl>
    );
};
