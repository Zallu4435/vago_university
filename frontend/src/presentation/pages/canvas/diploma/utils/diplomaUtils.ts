import { IconType } from 'react-icons';
import { FiPlay, FiTarget, FiCheckCircle, FiCode } from 'react-icons/fi';
import { ChapterType } from '../types/DiplomaTypes';

export const getChapterTypeIcon = (type: ChapterType): IconType => {
  switch (type) {
    case 'video': return FiPlay;
    case 'interactive': return FiTarget;
    case 'quiz': return FiCheckCircle;
    case 'project': return FiCode;
    default: return FiPlay;
  }
};

export const getChapterTypeColor = (type: ChapterType, styles: any): string => {
  switch (type) {
    case 'video': return styles.status.info;
    case 'interactive': return styles.status.success;
    case 'quiz': return styles.status.warning;
    case 'project': return styles.accentSecondary;
    default: return styles.status.info;
  }
};