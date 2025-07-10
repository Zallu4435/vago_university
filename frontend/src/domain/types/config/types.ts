export type ThemeType = 'light' | 'dark' | 'default';

export interface ThemeStyles {
  background: string;
  backgroundSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textWanted?: string;
  border: string;
  borderSecondary: string;
  accent: string;
  accentSecondary: string;
  accentTertiary: string;
  button: {
    primary: string;
    secondary: string;
    outline: string;
  };
  card: {
    background: string;
    border: string;
    hover: string;
  };
  input: {
    background: string;
    border: string;
    focus: string;
  };
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
    primary?: string;
  };
  icon: {
    primary: string;
    secondary: string;
  };
  orb: {
    primary: string;
    secondary: string;
  };
  pattern: {
    primary: string;
    secondary: string;
  };
  progress: {
    background: string;
    fill: string;
  };
} 