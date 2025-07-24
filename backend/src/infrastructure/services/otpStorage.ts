interface OtpEntry {
  otp: string;
  email: string;
  expiresAt: number;
}

class OtpStorage {
  private otps: Map<string, OtpEntry> = new Map();

  storeOtp(email: string, otp: string): void {
    const expiresAt = Date.now() + 10 * 60 * 1000;
    this.otps.set(email, { otp, email, expiresAt });
  }

  getOtp(email: string): OtpEntry | undefined {
    const entry = this.otps.get(email);
    if (entry && entry.expiresAt < Date.now()) {
      this.otps.delete(email);
      return undefined;
    }
    return entry;
  }

  clearOtp(email: string): void {
    this.otps.delete(email);
  }
}

export const otpStorage = new OtpStorage();