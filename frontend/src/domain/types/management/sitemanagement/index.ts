export interface SectionField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}

export interface Section {
  key: string;
  label: string;
  icon: React.ReactNode;
  fields: SectionField[];
}

export type SiteSectionKey = 'highlights' | 'vagoNow' | 'leadership';

export interface SiteSectionFormProps {
  fields: SectionField[];
  initialData?: Record<string, unknown>;
  onClose: () => void;
  onSuccess: (data: Record<string, unknown>) => void;
}

export interface SiteSectionViewModalProps {
  fields: SectionField[];
  data: Record<string, unknown>;
  onClose: () => void;
}

export type FormData = {
  title: string;
  description: string;
  image?: string;
  link?: string;
  category?: string;
};