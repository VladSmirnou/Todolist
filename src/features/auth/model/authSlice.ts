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
});

export const { name, reducer: authSliceReducer } = authSlice;
export const { selectIsLoggedIn } = authSlice.selectors;
export const { setIsLoggedIn } = authSlice.actions;
