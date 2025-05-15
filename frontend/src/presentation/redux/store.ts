import { configureStore } from "@reduxjs/toolkit";
import themeReducer from './theme.slice';
import authReducer from './authSlice'

const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
