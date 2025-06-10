import React from 'react';
import { Material } from '../types/MaterialTypes';
import { usePreferences } from '../../../../context/PreferencesContext';
import {
    FiDownload, FiInfo, FiHeart, FiShare2, FiBookmark,
    FiUser, FiClock, FiCalendar, FiBook, FiLock, FiStar, FiEye
} from 'react-icons/fi';
import { getFileIcon, getDifficultyColor, formatDate, formatNumber } from '../utils/materialUtils';

interface MaterialCardProps {
    material: Material;
    onDownload: (material: Material) => void;
    onBookmark: (materialId: number) => void;
    onLike: (materialId: number) => void;
    isBookmarked: boolean;
    isLiked: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
    material,
    onDownload,
    onBookmark,
    onLike,
    isBookmarked,
    isLiked
}) => {
    const { styles } = usePreferences();

    return (
        <div className={`group rounded-2xl shadow-sm transition-all duration-300 ${styles.card.border} overflow-hidden transform hover:-translate-y-1 flex flex-col h-[600px] w-full ${styles.card.background} ${styles.card.hover}`}>
            <div className="relative h-48 aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                    src={material.thumbnail}
                    alt={material.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                    {material.isNew && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                            NEW
                        </span>
                    )}
                    {material.isRestricted && (
                        <div className="bg-black/20 backdrop-blur-sm rounded-full p-1.5">
                            <FiLock className="text-white" size={14} />
                        </div>
                    )}
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                    <button
                        onClick={() => onBookmark(material.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                            isBookmarked || material.isBookmarked
                                ? styles.button.primary
                                : 'bg-black/20 text-white hover:bg-black/40'
                        }`}
                        aria-label={`Bookmark ${material.title}`}
                    >
                        <FiBookmark size={14} fill={isBookmarked || material.isBookmarked ? "currentColor" : "none"} />
                    </button>
                </div>
                <div className="absolute bottom-3 left-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(material.difficulty)}`}>
                        {material.difficulty}
                    </span>
                </div>
                <div className="absolute bottom-3 right-3">
                    <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
                        {React.createElement(getFileIcon(material.type), { size: 14 })}
                        <span className="ml-1">{material.type}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className={`text-lg font-bold ${styles.textPrimary} mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors`}>
                            {material.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm mb-2">
                            <span className={`flex items-center ${styles.button.secondary} px-2 py-1 rounded-full truncate max-w-[150px]`}>
                                <FiBook size={12} className={`mr-1 ${styles.icon.primary}`} />
                                {material.course}
                            </span>
                            <span className={`${styles.textSecondary} truncate max-w-[150px]`}>{material.subject}</span>
                        </div>
                    </div>
                </div>

                <p className={`text-sm ${styles.textSecondary} mb-4 line-clamp-3 leading-relaxed flex-grow`}>
                    {material.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {material.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={`text-xs ${styles.button.secondary} px-2 py-1 rounded-full truncate max-w-[100px]`}>
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="text-sm">
                        <div className={`flex items-center justify-center ${styles.icon.secondary} mb-1`}>
                            <FiDownload size={14} />
                        </div>
                        <div className={`font-semibold ${styles.textPrimary}`}>{formatNumber(material.downloads)}</div>
                        <div className={`text-xs ${styles.textTertiary}`}>Downloads</div>
                    </div>
                    <div className="text-sm">
                        <div className={`flex items-center justify-center ${styles.icon.secondary} mb-1`}>
                            <FiEye size={14} />
                        </div>
                        <div className={`font-semibold ${styles.textPrimary}`}>{formatNumber(material.views)}</div>
                        <div className={`text-xs ${styles.textTertiary}`}>Views</div>
                    </div>
                    <div className="text-sm">
                        <div className="flex items-center justify-center text-yellow-400 mb-1">
                            <FiStar size={14} fill="currentColor" />
                        </div>
                        <div className={`font-semibold ${styles.textPrimary}`}>{material.rating}</div>
                        <div className={`text-xs ${styles.textTertiary}`}>Rating</div>
                    </div>
                </div>

                <div className={`space-y-2 mb-4 text-sm ${styles.textSecondary}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center truncate max-w-[200px]">
                            <FiUser size={14} className={`mr-2 ${styles.icon.primary}`} />
                            <span className="truncate">{material.uploadedBy}</span>
                        </div>
                        <span className={styles.textTertiary}>{material.fileSize}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center truncate max-w-[200px]">
                            <FiClock size={14} className={`mr-2 ${styles.icon.primary}`} />
                            <span className="truncate">{material.estimatedTime}</span>
                        </div>
                        <div className={`flex items-center ${styles.textTertiary} truncate max-w-[200px]`}>
                            <FiCalendar size={14} className="mr-1" />
                            <span className="truncate">{formatDate(material.uploadDate)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 mt-auto">
                    <button
                        onClick={() => onDownload(material)}
                        className={`flex-1 ${styles.button.primary} px-4 py-2.5 rounded-xl flex items-center justify-center font-medium transition-all duration-200`}
                        aria-label={`Download ${material.title}`}
                    >
                        <FiDownload size={16} className="mr-2" />
                        Download
                    </button>
                    <button
                        onClick={() => onLike(material.id)}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${
                            isLiked || material.isLiked
                                ? `${styles.status.error} ${styles.button.primary}`
                                : styles.button.secondary
                        }`}
                        aria-label={`Like ${material.title}`}
                    >
                        <FiHeart size={16} fill={isLiked || material.isLiked ? "currentColor" : "none"} />
                    </button>
                    <button
                        className={`p-2.5 rounded-xl ${styles.button.secondary} transition-all duration-200`}
                        aria-label={`Share ${material.title}`}
                    >
                        <FiShare2 size={16} />
                    </button>
                    <button
                        className={`p-2.5 rounded-xl ${styles.button.secondary} transition-all duration-200`}
                        aria-label={`View details for ${material.title}`}
                    >
                        <FiInfo size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaterialCard; 