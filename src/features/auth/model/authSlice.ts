import { createAppSlice } from '@/common/utils/createAppSlice';
import { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
};

const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        },
    },
    selectors: {
        selectIsLoggedIn: (state) => state.isLoggedIn,
    },
    // reducers: (create) => ({
    //     setIsLoggedIn: create.reducer<boolean>((state, action) => {
    //         state.isLoggedIn = action.payload;
    //     }),
    //     me: create.asyncThunk<boolean, void>(async () => {
    //         const res = await authApi.me();
    //         return res.data.resultCode === ResultCode.Success;
    //     }),
    //     login: create.asyncThunk<boolean, LoginFormData>(
    //         async (data, { dispatch, rejectWithValue }) => {
    //             try {
    //                 const res = await authApi.login(data);
    //                 if (res.data.resultCode !== ResultCode.Success) {
    //                     if (res.data.fieldsErrors.length) {
    //                         dispatch(appStatusChanged(AppStatus.IDLE));
    //                         return rejectWithValue(res.data.fieldsErrors);
    //                     }
    //                     const errorMessage = res.data.messages[0];
    //                     dispatchAppStatusData(
    //                         dispatch,
    //                         AppStatus.FAILED,
    //                         errorMessage,
    //                     );
    //                     return false;
    //                 }
    //                 localStorage.setItem(AUTH_TOKEN_KEY, res.data.data.token);
    //                 dispatch(appStatusChanged(AppStatus.IDLE));
    //                 return true;
    //             } catch (e) {
    //                 // AxiosError / Error -> e.message
    //                 const errorMessage = (e as AxiosError | Error).message;
    //                 dispatchAppStatusData(
    //                     dispatch,
    //                     AppStatus.FAILED,
    //                     errorMessage,
    //                 );
    //                 return false;
    //             }
    //         },
    //     ),
    //     logout: create.asyncThunk<boolean, void>(async (_, { dispatch }) => {
    //         const userRemainsLoggedIn = true;
    //         try {
    //             const res = await authApi.logout();
    //             if (res.data.resultCode !== ResultCode.Success) {
    //                 dispatchAppStatusData(
    //                     dispatch,
    //                     AppStatus.FAILED,
    //                     'some error occured',
    //                 );
    //                 return userRemainsLoggedIn;
    //             }
    //             dispatch(appStatusChanged(AppStatus.IDLE));
    //             localStorage.removeItem(AUTH_TOKEN_KEY);
    //             return !userRemainsLoggedIn;
    //         } catch (e) {
    //             const errorMessage = (e as AxiosError | Error).message;
    //             dispatchAppStatusData(dispatch, AppStatus.FAILED, errorMessage);
    //             return userRemainsLoggedIn;
    //         }
    //     }),

    // extraReducers: (builder) => {
    //     builder.addMatcher(
    //         isAnyOf(me.fulfilled, login.fulfilled, logout.fulfilled),
    //         (state, action) => {
    //             state.isLoggedIn = action.payload;
    //         },
    //     );
    // },
});

export const { name, reducer: authSliceReducer } = authSlice;
export const { selectIsLoggedIn } = authSlice.selectors;
export const { setIsLoggedIn } = authSlice.actions;

// export const addAuthListeners = (startAppListening: AppStartListening) => {
//     startAppListening({
//         matcher: todolistsApi.endpoints.addTodolist.matchFulfilled,
//         effect: (_, { dispatch }) => {
//             dispatch(appStatusChanged(AppStatus.SUCCEEDED));
//             dispatch(appStatusTextSet('Todolist was successfully added'));
//         },
//     });
//     startAppListening({
//         matcher: tasksApi.endpoints.addTask.matchFulfilled,
//         effect: (_, { dispatch }) => {
//             dispatch(appStatusChanged(AppStatus.SUCCEEDED));
//             dispatch(appStatusTextSet('Task was successfully added'));
//         },
//     });
// };
