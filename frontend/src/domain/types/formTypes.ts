
export interface PersonalInfo {
  salutation: string;
  fullName: string;
  familyName: string;
  givenName: string;
  gender: string;
  dateOfBirth: string;
  postalCode: string;
  blockNumber: string;
  streetName: string;
  buildingName: string;
  floorNumber: string;
  unitNumber: string;
  stateCity: string;
  country: string;
  citizenship: string;
  residentialStatus: string;
  race: string;
  religion: string;
  maritalStatus: string;
  passportNumber: string;
  emailAddress: string;
  alternativeEmail: string;
  mobileCountry: string;
  mobileArea: string;
  mobileNumber: string;
  phoneCountry: string;
  phoneArea: string;
  phoneNumber: string;
  alternateContactName: string;
  relationshipWithApplicant: string;
  occupation: string;
  altMobileCountry: string;
  altMobileArea: string;
  altMobileNumber: string;
  altPhoneCountry: string;
  altPhoneArea: string;
  altPhoneNumber: string;
}

export interface ProgrammeChoice {
  programme: string;
  preferredMajor: string;
}

export type StudentType = 'local' | 'transfer' | 'international';

export interface LocalEducationData {
  schoolName: string;
  country: string;
  from: string;
  to: string;
  nationalID: string;
  localSchoolCategory: string;
  stateOrProvince: string;
}

export interface TransferEducationData {
  schoolName: string;
  country: string;
  from: string;
  to: string;
  previousUniversity: string;
  otherUniversity?: string;
  creditsEarned: string;
  gpa: string;
  programStudied: string;
  reasonForTransfer: string;
}

export interface Subject {
  subject: string;
  grade: string;
}

export interface InternationalEducationData {
  schoolName: string;
  country: string;
  from: string;
  to: string;
  examination: string;
  examMonthYear: string;
  resultType: 'actual' | 'predicted';
  subjects: Subject[];
}

export interface EducationData {
  studentType: StudentType;
  local?: LocalEducationData;
  transfer?: TransferEducationData;
  international?: InternationalEducationData;
}

export interface ReferenceContact {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: {
    country: string;
    area: string;
    number: string;
  };
}

export interface Achievement {
  activity: string;
  level: string;
  levelOfAchievement: string;
  positionHeld: string;
  organizationName: string;
  fromDate: string;
  toDate: string;
  description: string;
  reference?: ReferenceContact;
}

export interface AchievementSection {
  questions: { [questionId: number]: string };
  achievements: Achievement[];
  hasNoAchievements: boolean;
}

export interface HealthInfo {
  medicalConditions: string;
  disabilities: string;
  specialNeeds: string;
}

export interface LegalInfo {
  criminalRecord: string;
  legalProceedings: string;
}

export interface OtherInformationSection {
  health: HealthInfo;
  legal: LegalInfo;
}

export interface DocumentUpload {
  id: string;
  name: string;
  fileName?: string;
  fileType?: string;
}

export interface DocumentUploadSection {
  documents: DocumentUpload[];
}

export interface DeclarationSection {
  privacyPolicy: boolean;
  marketingEmail: boolean;
  marketingCall: boolean;
}

export interface FormData {
  applicationId?: string;
  personalInfo?: PersonalInfo;
  choiceOfStudy?: ProgrammeChoice[];
  education?: EducationData;
  achievements?: AchievementSection;
  otherInformation?: OtherInformationSection;
  documents?: DocumentUploadSection;
  declaration?: DeclarationSection;
  submittedAt?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
}