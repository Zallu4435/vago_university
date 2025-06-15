import { Material } from '../types/MaterialTypes';
import { FiFileText, FiBookOpen, FiFile, FiImage, FiVideo } from 'react-icons/fi';

export type FileIconType = typeof FiFileText | typeof FiBookOpen | typeof FiFile | typeof FiImage | typeof FiVideo;

export const getFileIcon = (type: string): FileIconType => {
    switch (type.toLowerCase()) {
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
    return num.toString();
};

export const filterMaterials = (
    materials: any[],
    searchTerm: string,
    selectedCourse: string,
    selectedType: string,
    selectedSemester: string,
    selectedDifficulty: string,
    sortBy: string
) => {
    // Extract the actual material objects from the nested structure
    const extractedMaterials = materials.map(item => item.props || item);

    let filtered = extractedMaterials.filter(material => {
        const matchesSearch = material.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            material.subject?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            material.uploadedBy?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            material.course?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            material.tags?.some((tag: string) => tag?.toLowerCase().includes(searchTerm?.toLowerCase()));

        const matchesCourse = !selectedCourse || material.course === selectedCourse;
        const matchesType = !selectedType || material.type === selectedType;
        const matchesSemester = !selectedSemester || material.semester === parseInt(selectedSemester);
        const matchesDifficulty = !selectedDifficulty || material.difficulty === selectedDifficulty;

        return matchesSearch && matchesCourse && matchesType && matchesSemester && matchesDifficulty;
    });

    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
            case 'oldest':
                return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
            case 'downloads':
                return b.downloads - a.downloads;
            case 'views':
                return b.views - a.views;
            case 'rating':
                return b.rating - a.rating;
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    return filtered;
}; 