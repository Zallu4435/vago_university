export interface GetUserDiplomasRequestDTO {
  userId: string;
  page: number;
  limit: number;
  category?: string;
  status?: string;
  dateRange?: string;
}

export interface GetUserDiplomaByIdRequestDTO {
  id: string;
}

export interface GetUserDiplomaChapterRequestDTO {
  courseId: string;
  chapterId: string;
}

export interface UpdateVideoProgressRequestDTO {
  courseId: string;
  chapterId: string;
  progress: number;
}

export interface MarkChapterCompleteRequestDTO {
  courseId: string;
  chapterId: string;
}

export interface ToggleBookmarkRequestDTO {
  courseId: string;
  chapterId: string;
} 