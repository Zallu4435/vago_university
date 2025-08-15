import React, { JSX } from 'react';

export interface Diploma {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
    duration: string;
    prerequisites: string[];
    status: boolean;
    createdAt: string;
    updatedAt: string;
    videoIds: string[];
    videoCount: number;
}

export interface Enrollment {
    id: string;
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    enrollmentDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    progress: number;
}

export interface DiplomaDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  diploma: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
    duration: string;
    prerequisites: string[];
    status: boolean;
    createdAt: string;
    updatedAt: string;
    enrolledStudents?: { id: string; name: string; email: string; enrollmentDate: string; progress: number }[];
  };
  isLoading: boolean;
}

export interface EnrollmentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: {
    _id: string;
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    enrollmentDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    progress: number;
  };
  isLoading: boolean;
}

// Update InfoCardProps to allow value: string | JSX.Element
export interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | JSX.Element;
}

export interface DiplomaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
  initialData?: unknown;
  isEditing?: boolean;
  categories: string[];
} 