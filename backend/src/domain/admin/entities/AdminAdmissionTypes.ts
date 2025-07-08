// AdminAdmissionTypes.ts

export type AdminAdmissionStatus = "pending" | "approved" | "rejected" | "offered";

export interface AdminAdmissionChoiceOfStudy {
  programme: string;
  degree?: string;
  catalogYear?: string;
}

export interface AdminAdmissionPersonal {
  fullName: string;
  emailAddress: string;
}

export interface AdminAdmission {
  _id?: string;
  registerId: string;
  applicationId: string;
  personal: AdminAdmissionPersonal;
  choiceOfStudy: AdminAdmissionChoiceOfStudy[];
  status: AdminAdmissionStatus;
  confirmationToken?: string;
  tokenExpiry?: Date;
  rejectedBy?: string;
  createdAt?: Date;
} 