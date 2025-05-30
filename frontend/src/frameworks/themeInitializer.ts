import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../presentation/redux/store'

export const useThemeInitializer = () => {
    const theme = useSelector((state: RootState) => state.theme.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
}