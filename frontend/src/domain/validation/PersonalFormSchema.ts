// PersonalFormSchema.ts
import { z } from 'zod';

// Phone number pattern (simple for demonstration)
const phonePattern = /^\d{8}$/; // 8 digits
const postalCodePattern = /^\d{6}$/; // 6 digits for Singapore postal code

export const personalFormSchema = z.object({
  // Personal details
  salutation: z.string().min(1, "Salutation is required"),
  fullName: z.string().min(2, "Full name is required").max(100, "Name is too long"),
  familyName: z.string().min(1, "Family name is required"),
  givenName: z.string().min(1, "Given name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  
  // Address details
  postalCode: z.string().regex(postalCodePattern, "Please enter a valid 6-digit postal code"),
  blockNumber: z.string().min(1, "Block number is required"),
  streetName: z.string().min(1, "Street name is required"),
  buildingName: z.string().optional(),
  floorNumber: z.string().optional(),
  unitNumber: z.string().optional(),
  stateCity: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  
  // Personal identification
  citizenship: z.string().min(1, "Citizenship is required"),
  residentialStatus: z.string().min(1, "Residential status is required"),
  race: z.string().min(1, "Race is required"),
  religion: z.string().optional(),
  maritalStatus: z.string().min(1, "Marital status is required"),
  passportNumber: z.string().min(1, "Passport number is required"),
  
  // Contact details
  emailAddress: z.string().email("Please enter a valid email address"),
  alternativeEmail: z.string().email("Please enter a valid alternative email").optional().or(z.literal('')),
  mobileCountry: z.string().min(1, "Country code is required"),
  mobileArea: z.string().optional(),
  mobileNumber: z.string().min(8, "Mobile number must be at least 8 digits"),
  phoneCountry: z.string().optional(),
  phoneArea: z.string().optional(),
  phoneNumber: z.string().optional(),
  
  // Alternative contact
  alternateContactName: z.string().min(1, "Contact name is required"),
  relationshipWithApplicant: z.string().min(1, "Relationship is required"),
  occupation: z.string().min(1, "Occupation is required"),
  altMobileCountry: z.string().min(1, "Country code is required"),
  altMobileArea: z.string().optional(),
  altMobileNumber: z.string().min(8, "Mobile number must be at least 8 digits"),
  altPhoneCountry: z.string().optional(),
  altPhoneArea: z.string().optional(),
  altPhoneNumber: z.string().optional(),
});

export type PersonalFormData = z.infer<typeof personalFormSchema>;