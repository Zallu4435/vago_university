export interface DocumentDTO {
    id: string;
    name: string;
    url: string;
    status: "Verified" | "Pending" | "Rejected";
  }
  
  export interface StudentFinancialInfoResponseDTO {
    id: string;
    studentId: string;
    chargeId: string;
    amount: number;
    paymentDueDate: string;
    status: "Paid" | "Pending";
    term: string;
    issuedAt: string;
    paidAt?: string;
    method?: string;
    createdAt: string;
    updatedAt: string;
    chargeTitle?: string;
    chargeDescription?: string;
  }
  
  export interface PaymentResponseDTO {
    id: string;
    studentId: string;
    date: string;
    description: string;
    method: "Credit Card" | "Bank Transfer" | "Financial Aid" | "Razorpay" | "stripe";
    amount: number;
    status: "Completed" | "Pending" | "Failed";
    receiptUrl?: string;
    metadata?: Record<string, any>;
  }
  
  export interface FinancialAidApplicationResponseDTO {
    id: string;
    studentId: string;
    term: string;
    status: "Approved" | "Pending" | "Rejected";
    amount: number;
    type: "Grant" | "Loan" | "Scholarship";
    applicationDate: string;
    documents: DocumentDTO[];
  }
  
  export interface ScholarshipResponseDTO {
    id: string;
    name: string;
    description: string;
    amount: number;
    deadline: string;
    requirements: string[];
    status: "Open" | "Closed";
    term: string;
  }
  
  export interface ScholarshipApplicationResponseDTO {
    id: string;
    scholarshipId: string;
    studentId: string;
    status: "Approved" | "Pending" | "Rejected";
    applicationDate: string;
    documents: DocumentDTO[];
  }
  
  export interface ChargeResponseDTO {
    id: string;
    title: string;
    description: string;
    amount: number;
    term: string;
    dueDate: string;
    applicableFor: string;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
    status?: "Active" | "Inactive";
  }
  
  export interface GetStudentFinancialInfoResponseDTO {
    info: StudentFinancialInfoResponseDTO[];
    history: Array<{
      id?: string; // Payment ID
      paidAt?: string;
      chargeTitle?: string;
      method?: string;
      amount: number;
    }>;
  }
  
  export interface GetAllPaymentsResponseDTO {
    data: PaymentResponseDTO[];
    totalPayments: number;
    totalPages: number;
    currentPage: number;
  }
  
  export interface GetOnePaymentResponseDTO {
    payment: PaymentResponseDTO;
  }
  
  export interface MakePaymentResponseDTO {
    id: string;
    orderId?: string;
    amount: number;
    currency?: string;
    status: "Completed" | "Pending" | "Failed";
    date?: string;
    description?: string;
    method?: "Credit Card" | "Bank Transfer" | "Financial Aid" | "Razorpay" | "stripe";
    metadata?: Record<string, any>;
  }
  
  export interface GetFinancialAidApplicationsResponseDTO {
    data: FinancialAidApplicationResponseDTO[];
  }
  
  export interface GetAllFinancialAidApplicationsResponseDTO {
    data: FinancialAidApplicationResponseDTO[];
    total: number;
  }
  
  export interface ApplyForFinancialAidResponseDTO {
    data: FinancialAidApplicationResponseDTO;
  }
  
  export interface GetAvailableScholarshipsResponseDTO {
    data: ScholarshipResponseDTO[];
  }
  
  export interface GetScholarshipApplicationsResponseDTO {
    data: ScholarshipApplicationResponseDTO[];
  }
  
  export interface GetAllScholarshipApplicationsResponseDTO {
    data: ScholarshipApplicationResponseDTO[];
    total: number;
  }
  
  export interface ApplyForScholarshipResponseDTO {
    data: ScholarshipApplicationResponseDTO;
  }
  
  export interface UploadDocumentResponseDTO {
    url: string;
  }
  
  export interface GetPaymentReceiptResponseDTO {
    url: string;
  }
  
  export interface UpdateFinancialAidApplicationResponseDTO {
    data: FinancialAidApplicationResponseDTO;
  }
  
  export interface UpdateScholarshipApplicationResponseDTO {
    data: ScholarshipApplicationResponseDTO;
  }
  
  export interface CreateChargeResponseDTO {
    charge: ChargeResponseDTO;
    studentFinancialInfos: StudentFinancialInfoResponseDTO[];
  }
  
  export interface GetAllChargesResponseDTO {
    data: ChargeResponseDTO[];
    total: number;
  }