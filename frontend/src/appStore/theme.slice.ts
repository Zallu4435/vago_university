import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '../domain/types/theme';

const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && ['light', 'dark', 'sepia', 'high-contrast'].includes(savedTheme)
        ? (savedTheme as Theme)
        : 'light';
};

interface ThemeState {
    theme: Theme;
}

const initialState: ThemeState = {
    theme: getInitialTheme() 
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        }
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
