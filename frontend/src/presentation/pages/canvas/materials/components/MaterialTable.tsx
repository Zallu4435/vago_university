import React from 'react';
import { usePreferences } from '../../../../../application/context/PreferencesContext';
import {
    FiDownload, FiBookmark, FiHeart, FiMoreVertical
} from 'react-icons/fi';
import { getFileIcon, getDifficultyColor } from '../utils/materialUtils';
import { MaterialTableProps } from '../../../../../domain/types/canvas/materials';


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
        <div className={`${styles.card.background} rounded-xl sm:rounded-2xl shadow-lg overflow-hidden ${styles.card.border}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${styles.card.background} border-b ${styles.borderSecondary}`}>
                        <tr>
                            <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium ${styles.textPrimary}`}>Material</th>
                            <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium ${styles.textPrimary} hidden sm:table-cell`}>Course</th>
                            <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium ${styles.textPrimary} hidden md:table-cell`}>Type</th>
                            <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium ${styles.textPrimary} hidden lg:table-cell`}>Semester</th>
                            <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium ${styles.textPrimary} hidden md:table-cell`}>Difficulty</th>
                            <th className={`px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-medium ${styles.textPrimary}`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${styles.borderSecondary}`}>
                        {materials.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={`py-6 sm:py-8 text-center text-sm ${styles.textSecondary}`}>No materials found. Try adjusting your filters.</td>
                            </tr>
                        ) : (
                            materials.map(material => {
                                // Extract material data from props structure
                                const materialData = material.props || material;
                                
                                return (
                                    <tr key={materialData.id} className={`hover:bg-gray-50/50 transition-colors duration-150`}>
                                        <td className="py-4 sm:py-6 px-3 sm:px-6 w-[60%] sm:w-[30%]">
                                            <div className="flex items-center space-x-2 sm:space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${styles.pattern.secondary} flex items-center justify-center`}>
                                                        {React.createElement(getFileIcon(materialData.type), { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`text-xs sm:text-sm font-medium ${styles.textPrimary} truncate`}>
                                                        {materialData.title}
                                                    </h3>
                                                    <p className={`text-[10px] sm:text-xs ${styles.textSecondary} truncate hidden sm:block`}>
                                                        {materialData.description}
                                                    </p>
                                                    <div className="flex items-center space-x-2 sm:hidden mt-1">
                                                        <span className={`text-[10px] ${styles.textSecondary}`}>{materialData.course}</span>
                                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getDifficultyColor(materialData.difficulty)}`}>
                                                            {materialData.difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 sm:py-6 px-3 sm:px-6 hidden sm:table-cell">
                                            <div className={`text-xs sm:text-sm ${styles.textPrimary}`}>{materialData.course}</div>
                                            <div className={`text-[10px] sm:text-xs ${styles.textSecondary}`}>{materialData.subject}</div>
                                        </td>
                                        <td className="py-4 sm:py-6 px-3 sm:px-6 hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${styles.button.secondary}`}>
                                                {materialData.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 sm:py-6 px-3 sm:px-6 hidden lg:table-cell">
                                            <span className={`text-xs sm:text-sm ${styles.textPrimary}`}>
                                                {getSemesterName(materialData.semester)}
                                            </span>
                                        </td>
                                        <td className="py-4 sm:py-6 px-3 sm:px-6 hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getDifficultyColor(materialData.difficulty)}`}>
                                                {materialData.difficulty}
                                            </span>
                                        </td>
                                        <td className="py-4 sm:py-6 px-3 sm:px-6">
                                            <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                                                <button
                                                    onClick={() => onDownload(material)}
                                                    className={`p-1.5 sm:p-2 rounded-lg ${styles.button.primary} transition-colors`}
                                                    aria-label={`Download ${materialData.title}`}
                                                >
                                                    <FiDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onBookmark(materialData.id)}
                                                    className={`p-1.5 sm:p-2 rounded-lg ${materialData.isBookmarked ? styles.button.primary : styles.button.secondary} transition-colors hidden sm:block`}
                                                    aria-label={`Bookmark ${materialData.title}`}
                                                >
                                                    <FiBookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill={materialData.isBookmarked ? "currentColor" : "none"} />
                                                </button>
                                                <button
                                                    onClick={() => onLike(materialData.id)}
                                                    className={`p-1.5 sm:p-2 rounded-lg ${materialData.isLiked ? styles.button.primary : styles.button.secondary} transition-colors hidden sm:block`}
                                                    aria-label={`Like ${materialData.title}`}
                                                >
                                                    <FiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill={materialData.isLiked ? "currentColor" : "none"} />
                                                </button>
                                                <button
                                                    className={`p-1.5 sm:p-2 rounded-lg ${styles.button.secondary} transition-colors sm:hidden`}
                                                    aria-label="More actions"
                                                >
                                                    <FiMoreVertical className="w-3.5 h-3.5" />
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