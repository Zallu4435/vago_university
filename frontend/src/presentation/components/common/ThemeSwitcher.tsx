import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../appStore/store';
import { Theme } from '../../../domain/types/theme';
import { setTheme } from '../../../appStore/theme.slice';

const ThemeSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.theme);

  const themes: { id: Theme; label: string }[] = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'sepia', label: 'Sepia' },
    { id: 'high-contrast', label: 'High Contrast' },
  ];

  const handleThemeChange = (theme: Theme) => {
    dispatch(setTheme(theme));
  };

  return (
    <div className="flex space-x-2 p-2 rounded-md bg-[var(--color-background-light)] [data-theme=dark]:bg-[var(--color-background-dark)] [data-theme=sepia]:bg-[var(--color-background-sepia)] [data-theme=high-contrast]:bg-[var(--color-background-high-contrast)]">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => handleThemeChange(theme.id)}
          className={`px-3 py-1 rounded-md text-sm font-medium text-[var(--color-text-light)] [data-theme=dark]:text-[var(--color-text-dark)] [data-theme=sepia]:text-[var(--color-text-sepia)] [data-theme=high-contrast]:text-[var(--color-text-high-contrast)] ${
            currentTheme === theme.id
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;