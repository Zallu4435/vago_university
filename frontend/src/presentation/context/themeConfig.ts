import { ThemeType, ThemeStyles } from './types';

export const themes: Record<ThemeType, ThemeStyles> = {
  dark: {
    background: 'bg-slate-950',
    backgroundSecondary: 'bg-slate-900',
    textPrimary: 'text-slate-200',
    textSecondary: 'text-slate-300',
    textTertiary: 'text-slate-400',
    textWanted: 'text-black',
    border: 'border-slate-800',
    borderSecondary: 'border-slate-700',
    accent: 'from-slate-500 to-slate-400',
    accentSecondary: 'from-slate-400 to-slate-500',
    accentTertiary: 'from-slate-600 to-slate-400',
    button: {
      primary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 shadow-md shadow-slate-400/10',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-300 shadow-sm',
      outline: 'border-slate-600 text-slate-400 hover:bg-slate-600/10 hover:shadow-sm hover:shadow-slate-400/10',
    },
    card: {
      background: 'bg-slate-900/90 backdrop-blur-sm',
      border: 'border-slate-800',
      hover: 'hover:bg-slate-800/70 hover:shadow-md hover:shadow-slate-400/8 hover:border-slate-700',
    },
    input: {
      background: 'bg-slate-900',
      border: 'border-slate-800',
      focus: 'focus:border-slate-600 focus:shadow-sm focus:shadow-slate-400/10',
    },
    status: {
      success: 'text-emerald-400',
      error: 'text-red-400',
      warning: 'text-amber-400',
      info: 'text-slate-400',
      primary: 'text-sky-400',
    },
    icon: {
      primary: 'text-slate-400',
      secondary: 'text-slate-500',
    },
    orb: {
      primary: 'from-slate-400/20 to-slate-500/20',
      secondary: 'from-slate-500/15 to-slate-400/15',
    },
    pattern: {
      primary: 'border-slate-600/20',
      secondary: 'from-slate-400/15 to-slate-500/15',
    },
    progress: {
      background: 'bg-slate-800',
      fill: 'bg-gradient-to-r from-slate-600 to-slate-500 shadow-sm shadow-slate-400/10',
    },
  },
  light: {
    background: 'bg-white',
    backgroundSecondary: 'bg-slate-50',
    textPrimary: 'text-slate-700',
    textSecondary: 'text-slate-600',
    textTertiary: 'text-slate-400',
    border: 'border-slate-200',
    borderSecondary: 'border-slate-100',
    accent: 'from-slate-300 to-slate-400',
    accentSecondary: 'from-slate-200 to-slate-300',
    accentTertiary: 'from-slate-100 to-slate-200',
    button: {
      primary: 'bg-slate-600 hover:bg-slate-700 text-white',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
      outline: 'border-slate-400 text-slate-600 hover:bg-slate-50',
    },
    card: {
      background: 'bg-slate-50',
      border: 'border-slate-200',
      hover: 'hover:bg-slate-100',
    },
    input: {
      background: 'bg-white',
      border: 'border-slate-200',
      focus: 'focus:border-slate-400',
    },
    status: {
      success: 'text-emerald-600',
      error: 'text-red-600',
      warning: 'text-amber-600',
      info: 'text-slate-600',
      primary: 'text-sky-600',
    },
    icon: {
      primary: 'text-slate-500',
      secondary: 'text-slate-600',
    },
    orb: {
      primary: 'from-slate-200/20 to-slate-300/20',
      secondary: 'from-slate-100/15 to-slate-200/15',
    },
    pattern: {
      primary: 'border-slate-300/20',
      secondary: 'from-slate-200/15 to-slate-300/15',
    },
    progress: {
      background: 'bg-slate-200',
      fill: 'bg-gradient-to-r from-slate-400 to-slate-500',
    },
  },
  default: {
    background: 'bg-white',
    backgroundSecondary: 'bg-amber-50',
    textPrimary: 'text-slate-700',
    textSecondary: 'text-slate-600',
    textTertiary: 'text-slate-400',
    border: 'border-amber-200',
    borderSecondary: 'border-amber-100',
    accent: 'from-amber-200 to-amber-300',
    accentSecondary: 'from-amber-100 to-amber-200',
    accentTertiary: 'from-amber-50 to-amber-100',
    button: {
      primary: 'bg-amber-500 hover:bg-amber-600 text-white',
      secondary: 'bg-amber-100 hover:bg-amber-200 text-slate-700',
      outline: 'border-amber-400 text-amber-600 hover:bg-amber-50',
    },
    card: {
      background: 'bg-white',
      border: 'border-amber-200',
      hover: 'hover:bg-amber-50',
    },
    input: {
      background: 'bg-white',
      border: 'border-amber-200',
      focus: 'focus:border-amber-400',
    },
    status: {
      success: 'text-emerald-600',
      error: 'text-red-600',
      warning: 'text-amber-600',
      info: 'text-slate-600',
      primary: 'text-amber-600',
    },
    icon: {
      primary: 'text-amber-500',
      secondary: 'text-slate-600',
    },
    orb: {
      primary: 'from-amber-200/25 to-amber-300/25',
      secondary: 'from-amber-100/20 to-amber-200/20',
    },
    pattern: {
      primary: 'border-amber-300/25',
      secondary: 'from-amber-200/20 to-amber-300/20',
    },
    progress: {
      background: 'bg-amber-100',
      fill: 'bg-gradient-to-r from-amber-300 to-amber-400',
    },
  },
};

export const getThemeStyles = (theme: ThemeType): ThemeStyles => {
  return themes[theme] || themes.default;
};

export default themes;