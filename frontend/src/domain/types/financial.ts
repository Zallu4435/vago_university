export interface StudentFinancialInfo {
  id: string;
  name: string;
  accountBalance: number;
  paymentDueDate: string;
  financialAidStatus: 'Approved' | 'Pending' | 'Rejected';
  term: string;
}

export interface Charge {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  term: string;
}

export interface Payment {
  id: string;
  date: string;
  description: string;
  method: 'Credit Card' | 'Bank Transfer' | 'Financial Aid';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  receiptUrl?: string;
}

export interface FinancialAidApplication {
  id: string;
  studentId: string;
  term: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  amount: number;
  type: 'Grant' | 'Loan' | 'Scholarship';
  applicationDate: string;
  documents: Array<{
    id: string;
    name: string;
    url: string;
    status: 'Verified' | 'Pending' | 'Rejected';
  }>;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  requirements: string[];
  status: 'Open' | 'Closed';
  term: string;
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  studentId: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  applicationDate: string;
  documents: Array<{
    id: string;
    name: string;
    url: string;
    status: 'Verified' | 'Pending' | 'Rejected';
  }>;
}

export interface PaymentForm {
  amount: number;
  method: 'Credit Card' | 'Bank Transfer' | 'Financial Aid';
  term: string;
} 