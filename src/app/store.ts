import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;

// typeof store.dispatch returns ThunkDispatch<RootState, undefined, UnknownAction>
// so I will be able to dispatch everything without any type checking
// because of that I'll combine my reducer actions myself
export type AppDispatch = ThunkDispatch<RootState, undefined, { type: 'stub' }>;
