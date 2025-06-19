import React from 'react';
import { Material } from '../types/MaterialTypes';
import { usePreferences } from '../../../../context/PreferencesContext';
import {
    FiDownload, FiBookmark, FiHeart, FiLock, FiStar,
    FiEye, FiClock, FiCalendar, FiUser, FiBook
} from 'react-icons/fi';
import { getFileIcon, getDifficultyColor, formatDate, formatNumber } from '../utils/materialUtils';

interface MaterialTableProps {
    materials: Material[];
    onDownload: (material: Material) => void;
    onBookmark: (materialId: string) => void;
    onLike: (materialId: string) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({ materials, onDownload, onBookmark, onLike }) => {
    const { styles } = usePreferences();

    // Function to convert semester number to readable name
    const getSemesterName = (semester: number) => {
        const currentYear = new Date().getFullYear();
        const semesterNames = {
            1: `Fall ${currentYear}`,
            2: `Spring ${currentYear + 1}`,
            3: `Summer ${currentYear + 1}`,
            4: `Fall ${currentYear + 1}`,
            5: `Spring ${currentYear + 2}`,
            6: `Summer ${currentYear + 2}`,
            7: `Fall ${currentYear + 2}`,
            8: `Spring ${currentYear + 3}`
        };
        return semesterNames[semester as keyof typeof semesterNames] || `Semester ${semester}`;
    };

    return (
        <div className={`${styles.card.background} rounded-2xl shadow-lg overflow-hidden ${styles.card.border}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${styles.card.background} border-b ${styles.borderSecondary}`}>
                        <tr>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textPrimary}`}>Material</th>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textPrimary}`}>Course</th>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textPrimary}`}>Type</th>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textPrimary}`}>Semester</th>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textPrimary}`}>Difficulty</th>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${styles.textPrimary}`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${styles.borderSecondary}`}>
                        {materials.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={`py-8 text-center ${styles.textSecondary}`}>No materials found. Try adjusting your filters.</td>
                            </tr>
                        ) : (
                            materials.map(material => {
                                // Extract material data from props structure
                                const materialData = material.props || material;
                                
                                return (
                                    <tr key={materialData._id} className={`hover:bg-gray-50/50 transition-colors duration-150`}>
                                        <td className="py-6 px-6 w-[30%]">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${styles.pattern.secondary} flex items-center justify-center`}>
                                                        {React.createElement(getFileIcon(materialData.type), { size: 24 })}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`text-sm font-medium ${styles.textPrimary} truncate`}>
                                                        {materialData.title}
                                                    </h3>
                                                    <p className={`text-xs ${styles.textSecondary} truncate`}>
                                                        {materialData.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className={`text-sm ${styles.textPrimary}`}>{materialData.course}</div>
                                            <div className={`text-xs ${styles.textSecondary}`}>{materialData.subject}</div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.button.secondary}`}>
                                                {materialData.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-6 px-6">
                                            <span className={`text-sm ${styles.textPrimary}`}>
                                                {getSemesterName(materialData.semester)}
                                            </span>
                                        </td>
                                        <td className="py-6 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(materialData.difficulty)}`}>
                                                {materialData.difficulty}
                                            </span>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => onDownload(material)}
                                                    className={`p-2 rounded-lg ${styles.button.primary} transition-colors`}
                                                    aria-label={`Download ${materialData.title}`}
                                                >
                                                    <FiDownload size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onBookmark(materialData._id)}
                                                    className={`p-2 rounded-lg ${styles.button.secondary} transition-colors`}
                                                    aria-label={`Bookmark ${materialData.title}`}
                                                >
                                                    <FiBookmark size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onLike(materialData._id)}
                                                    className={`p-2 rounded-lg ${styles.button.secondary} transition-colors`}
                                                    aria-label={`Like ${materialData.title}`}
                                                >
                                                    <FiHeart size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaterialTable; 