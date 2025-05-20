import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');
    return hashedPassword;
  } catch (error: any) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compares a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password comparison completed:', isMatch);
    return isMatch;
  } catch (error: any) {
    console.error('Error comparing passwords:', error);
    throw new Error('Failed to compare passwords');
  }
}


export function generatePassword(length = 12): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';  // Removed I and O to avoid confusion
  const lowercase = 'abcdefghijkmnopqrstuvwxyz';  // Removed l to avoid confusion
  const numbers = '23456789';  // Removed 0 and 1 to avoid confusion
  const specialChars = '!@#$%^&*()_+=-';
  
  const allChars = uppercase + lowercase + numbers + specialChars;
  
  // Ensure at least one character from each category
  let password = 
    uppercase[Math.floor(Math.random() * uppercase.length)] +
    lowercase[Math.floor(Math.random() * lowercase.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Fill the rest with random characters from all categories
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }
  
  // Shuffle the password to avoid predictable patterns
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}