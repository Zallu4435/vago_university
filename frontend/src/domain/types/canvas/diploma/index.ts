export interface ChapterItemProps {
  chapter: Chapter;
  courseId: string;
  styles: any;
  isFirst: boolean;
  isPrevCompleted: boolean;
  isCompleted: boolean;
  isBookmarked: boolean;
  onViewChapter: (chapter: Chapter) => void;
  onBookmark: (courseId: string, chapterId: string) => void;
}

export interface Chapter {
  id: string;
  _id?: string;
  title: string;
  description: string;
  type: string;
  duration: string;
  order?: number;
  isCompleted?: boolean;
  isBookmarked?: boolean;
  [key: string]: any;
}

export interface DiplomaCourse {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
  isEnrolled?: boolean;
  [key: string]: any;
}

export interface DiplomaCardProps {
  course: DiplomaCourse;
  index: number;
  styles: any;
  userAdmitted: boolean;
  completedChapters: Set<string>;
  onViewDetails: (course: DiplomaCourse) => void;
  onStartCourse: (courseId: string) => void;
}

export interface VideoPlayerProps {
  styles: any;
  isPlaying: boolean;
  videoProgress: number;
  onPlayPause: () => void;
}

export type ViewMode = 'grid' | 'table' | 'courses' | 'details';
