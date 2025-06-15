export interface GetDiplomasRequestDTO {
  page: number;
  limit: number;
  department: string;
  status: string;
  instructor: string;
  dateRange: string;
}

export interface GetDiplomaByIdRequestDTO {
  id: string;
}

export interface CreateDiplomaRequestDTO {
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  duration: string;
  prerequisites: string[];
  status: boolean;
}

export interface UpdateDiplomaRequestDTO {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  thumbnail?: string;
  duration?: string;
  prerequisites?: string[];
  status?: boolean;
}

export interface DeleteDiplomaRequestDTO {
  id: string;
}

export interface EnrollStudentRequestDTO {
  diplomaId: string;
  studentId: string;
}

export interface UnenrollStudentRequestDTO {
  diplomaId: string;
  studentId: string;
} 