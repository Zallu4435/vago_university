import { Material } from '../types/MaterialTypes';
import { FiFileText, FiBookOpen, FiFile, FiImage, FiVideo } from 'react-icons/fi';

export type FileIconType = typeof FiFileText | typeof FiBookOpen | typeof FiFile | typeof FiImage | typeof FiVideo;

export const getFileIcon = (type: string): FileIconType => {
    switch (type?.toLowerCase()) {
        case 'pdf': return FiFileText;
        case 'doc': case 'docx': return FiBookOpen;
        case 'ppt': case 'pptx': return FiFileText;
        case 'xls': case 'xlsx': return FiFileText;
        case 'jpg': case 'png': case 'gif': return FiImage;
        case 'mp4': case 'avi': return FiVideo;
        default: return FiFile;
    }
};

export const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'Beginner': return 'text-green-600 bg-green-100';
        case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
        case 'Advanced': return 'text-red-600 bg-red-100';
        default: return 'text-blue-600 bg-blue-100';
    }
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatNumber = (num: number) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num?.toString();
};

// filterMaterials function removed - all filtering and sorting now handled by backend 