import React from 'react';
import { Material } from '../types/MaterialTypes';
import { usePreferences } from '../../../../context/PreferencesContext';
import {
    FiDownload, FiBookmark, FiHeart, FiLock, FiStar,
    FiEye, FiClock, FiCalendar, FiUser
} from 'react-icons/fi';
import { getFileIcon, getDifficultyColor, formatDate, formatNumber } from '../utils/materialUtils';

interface MaterialTableProps {
    materials: Material[];
    onDownload: (material: Material) => void;
    onBookmark: (materialId: number) => void;
    onLike: (materialId: number) => void;
    bookmarkedMaterials: Set<number>;
    likedMaterials: Set<number>;
}

const MaterialTable: React.FC<MaterialTableProps> = ({
    materials,
    onDownload,
    onBookmark,
    onLike,
    bookmarkedMaterials,
    likedMaterials
}) => {
    const { styles } = usePreferences();

    return (
        <div className={`${styles.card.background} rounded-2xl shadow-lg overflow-hidden ${styles.card.border}`}>
            <div className="overflow-x-auto">
                <table className="table-auto w-full">
                    <thead className={`bg-gradient-to-r ${styles.pattern.secondary} border-b ${styles.borderSecondary}`}>
                        <tr>
                            <th className={`py-4 px-6 text-left text-sm font-semibold ${styles.textPrimary} w-[30%]`}>Material</th>
                            <th className={`py-4 px-6 text-left text-sm font-semibold ${styles.textPrimary} w-[20%]`}>Course</th>
                            <th className={`py-4 px-6 text-left text-sm font-semibold ${styles.textPrimary} w-[20%]`}>Instructor</th>
                            <th className={`py-4 px-6 text-left text-sm font-semibold ${styles.textPrimary} w-[15%]`}>Stats</th>
                            <th className={`py-4 px-6 text-left text-sm font-semibold ${styles.textPrimary} w-[10%]`}>Rating</th>
                            <th className={`py-4 px-6 text-center text-sm font-semibold ${styles.textPrimary} w-[15%]`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${styles.borderSecondary}`}>
                        {materials.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={`py-8 text-center ${styles.textSecondary}`}>No materials found. Try adjusting your filters.</td>
                            </tr>
                        ) : (
                            materials.map(material => (
                                <tr key={material.id} className={`hover:bg-gray-50/50 transition-colors duration-150`}>
                                    <td className="py-6 px-6 w-[30%]">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${styles.pattern.secondary} flex items-center justify-center`}>
                                                    {React.createElement(getFileIcon(material.type), { size: 24 })}
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className={`font-semibold ${styles.textPrimary} truncate max-w-[250px]`}>{material.title}</h3>
                                                <p className={`text-sm ${styles.textSecondary} truncate max-w-[250px]`}>{material.description}</p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    {material.isNew && (
                                                        <span className={`bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full`}>
                                                            NEW
                                                        </span>
                                                    )}
                                                    {material.isRestricted && (
                                                        <FiLock className={styles.icon.secondary} size={14} />
                                                    )}
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(material.difficulty)}`}>
                                                        {material.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 w-[20%]">
                                        <div className="text-sm">
                                            <div className={`font-medium ${styles.textPrimary} truncate max-w-[150px]`}>{material.course}</div>
                                            <div className={`${styles.textSecondary} truncate max-w-[150px]`}>{material.subject}</div>
                                            <div className={`text-xs ${styles.textTertiary} mt-1 truncate max-w-[150px]`}>{material.semester}</div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 w-[20%]">
                                        <div className="text-sm">
                                            <div className={`font-medium ${styles.textPrimary} truncate max-w-[150px]`}>{material.uploadedBy}</div>
                                            <div className={`text-xs ${styles.textSecondary} mt-1 truncate max-w-[150px]`}>{formatDate(material.uploadDate)}</div>
                                            <div className={`text-xs ${styles.textTertiary} truncate max-w-[150px]`}>{material.fileSize}</div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 w-[15%]">
                                        <div className="flex flex-col space-y-1 text-sm">
                                            <div className={`flex items-center ${styles.textSecondary}`}>
                                                <FiDownload size={14} className={`mr-1 ${styles.icon.secondary}`} />
                                                <span>{formatNumber(material.downloads)}</span>
                                            </div>
                                            <div className={`flex items-center ${styles.textSecondary}`}>
                                                <FiEye size={14} className={`mr-1 ${styles.icon.secondary}`} />
                                                <span>{formatNumber(material.views)}</span>
                                            </div>
                                            <div className={`flex items-center ${styles.textSecondary}`}>
                                                <FiClock size={14} className={`mr-1 ${styles.icon.secondary}`} />
                                                <span className="truncate">{material.estimatedTime}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 w-[10%]">
                                        <div className="flex items-center">
                                            <FiStar className="text-yellow-400 mr-1" size={16} fill="currentColor" />
                                            <span className={`text-sm font-medium ${styles.textPrimary}`}>{material.rating}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 w-[15%]">
                                        <div className="flex items-center space-x-2 justify-center">
                                            <button
                                                onClick={() => onBookmark(material.id)}
                                                className={`p-2 rounded-lg transition-all duration-200 ${
                                                    bookmarkedMaterials.has(material.id) || material.isBookmarked
                                                        ? styles.button.primary
                                                        : styles.button.secondary
                                                }`}
                                                aria-label={`Bookmark ${material.title}`}
                                            >
                                                <FiBookmark size={16} fill={bookmarkedMaterials.has(material.id) || material.isBookmarked ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                onClick={() => onLike(material.id)}
                                                className={`p-2 rounded-lg transition-all duration-200 ${
                                                    likedMaterials.has(material.id) || material.isLiked
                                                        ? `${styles.status.error} ${styles.button.primary}`
                                                        : styles.button.secondary
                                                }`}
                                                aria-label={`Like ${material.title}`}
                                            >
                                                <FiHeart size={16} fill={likedMaterials.has(material.id) || material.isLiked ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                onClick={() => onDownload(material)}
                                                className={`${styles.button.primary} px-4 py-2 rounded-lg flex items-center transition-all duration-200`}
                                                aria-label={`Download ${material.title}`}
                                            >
                                                <FiDownload size={14} className="mr-1" />
                                                Download
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaterialTable; 