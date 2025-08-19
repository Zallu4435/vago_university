import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeType } from '../domain/types/config/types';

const getInitialTheme = (): ThemeType => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && ['light', 'dark', 'sepia', 'high-contrast'].includes(savedTheme)
        ? (savedTheme as ThemeType)
        : 'light';
};

interface ThemeState {
    theme: ThemeType;
}

const initialState: ThemeState = {
    theme: getInitialTheme() 
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeType>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        }
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
