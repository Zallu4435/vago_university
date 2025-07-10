export type MobileOTPStep = 'phone' | 'otp';
export type EmailOTPStep = 'email' | 'otp' | 'change-password';

export interface MobileOTPComponentProps {
  onBack: () => void;
  onClose: () => void;
}

export interface EmailOTPComponentProps {
  onBack: () => void;
  onClose: () => void;
  onVerified: (email: string) => void;
} 