import React, { useState, useEffect } from 'react';
import { 
    FiSearch,
    FiDownload,
    FiInfo,
    FiFilter,
    FiCalendar,
    FiUser,
    FiBook,
    FiFileText,
    FiFile,
    FiLock,
    FiGrid,
    FiList,
    FiChevronDown,
    FiStar,
    FiEye,
    FiHeart,
    FiShare2,
    FiBookmark,
    FiTrendingUp,
    FiClock,
    FiUsers,
    FiAward,
    FiPlay,
    FiImage,
    FiVideo,
    FiBookOpen,
    FiX,
    FiPlus,
    FiRefreshCw
} from 'react-icons/fi';
import { usePreferences } from '../../../context/PreferencesContext';
import MaterialCard from './components/MaterialCard';
import MaterialTable from './components/MaterialTable';
import MaterialFilters from './components/MaterialFilters';
import { Material, ViewMode, SortOption } from './types/MaterialTypes';
import { filterMaterials } from './utils/materialUtils';

// Sample data - replace with actual API call
const sampleMaterials: Material[] = [
    {
      id: 1,
        title: "Introduction to Data Structures",
        subject: "Computer Science",
        course: "CS101",
        semester: "Fall 2023",
        type: "pdf",
        uploadedBy: "Dr. Smith",
        uploadDate: "2023-09-15",
        downloads: 1500,
        views: 3000,
        fileSize: "2.5 MB",
        description: "Comprehensive guide to basic data structures and algorithms",
      isNew: true,
      isRestricted: false,
      rating: 4.8,
        tags: ["algorithms", "data-structures", "computer-science"],
        thumbnail: "/images/materials/ds-thumb.jpg",
        difficulty: "Beginner",
        estimatedTime: "2 hours",
      isBookmarked: false,
      isLiked: false
    },
    {
      id: 2,
        title: "Introduction to Data Structures",
      subject: "Computer Science",
        course: "CS101",
        semester: "Fall 2023",
        type: "pdf",
        uploadedBy: "Dr. Smith",
        uploadDate: "2023-09-15",
        downloads: 1500,
        views: 3000,
        fileSize: "2.5 MB",
        description: "Comprehensive guide to basic data structures and algorithms",
      isNew: true,
        isRestricted: false,
        rating: 4.8,
        tags: ["algorithms", "data-structures", "computer-science"],
        thumbnail: "/images/materials/ds-thumb.jpg",
        difficulty: "Beginner",
        estimatedTime: "2 hours",
      isBookmarked: false,
      isLiked: false
    },
    // Add more sample materials here
];

const StudyMaterialsPage: React.FC = () => {
    const { styles } = usePreferences();
    const [materials, setMaterials] = useState<Material[]>(sampleMaterials);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
    const [bookmarkedMaterials, setBookmarkedMaterials] = useState<Set<number>>(new Set());
    const [likedMaterials, setLikedMaterials] = useState<Set<number>>(new Set());

    const filteredMaterials = filterMaterials(
        materials,
        searchTerm,
        selectedCourse,
        selectedType,
        selectedSemester,
        selectedDifficulty,
        sortBy
    );

    const handleDownload = (material: Material) => {
        // Implement download logic
        console.log('Downloading:', material.title);
    };

    const handleBookmark = (materialId: number) => {
        setBookmarkedMaterials(prev => {
            const newSet = new Set(prev);
            if (newSet.has(materialId)) {
                newSet.delete(materialId);
    } else {
                newSet.add(materialId);
            }
            return newSet;
        });
    };

    const handleLike = (materialId: number) => {
        setLikedMaterials(prev => {
            const newSet = new Set(prev);
            if (newSet.has(materialId)) {
                newSet.delete(materialId);
    } else {
                newSet.add(materialId);
            }
            return newSet;
    });
  };

  return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
                    <h1 className={`text-4xl font-bold ${styles.textPrimary} mb-2`}>
                        Study Materials
              </h1>
                    <p className={`${styles.textSecondary} text-lg`}>
                        Download, view, and stay equipped with your resources
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className={`${styles.button.primary} px-4 py-2 rounded-xl flex items-center gap-2`}>
                        <FiRefreshCw className="h-4 w-4" />
                        Sync
                    </button>
                    <button className={`${styles.button.primary} px-4 py-2 rounded-xl flex items-center gap-2`}>
                        <FiDownload className="h-4 w-4" />
                        Bulk Download
                    </button>
              </div>
            </div>

            <MaterialFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedSemester={selectedSemester}
                setSelectedSemester={setSelectedSemester}
                selectedDifficulty={selectedDifficulty}
                setSelectedDifficulty={setSelectedDifficulty}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                materials={materials}
            />

            <div className="flex justify-end mb-6">
                <div className={`${styles.card.background} rounded-lg p-1 flex space-x-1 ${styles.card.border}`}>
                <button
                  onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? styles.button.primary : styles.button.secondary
                  }`}
                        aria-label="Grid view"
                >
                        <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'table' ? styles.button.primary : styles.button.secondary
                  }`}
                        aria-label="Table view"
                >
                        <FiList size={20} />
                </button>
        </div>
      </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMaterials.map(material => (
                        <MaterialCard
                            key={material.id}
                            material={material}
                            onDownload={handleDownload}
                            onBookmark={handleBookmark}
                            onLike={handleLike}
                            isBookmarked={bookmarkedMaterials.has(material.id) || material.isBookmarked}
                            isLiked={likedMaterials.has(material.id) || material.isLiked}
                        />
                    ))}
                </div>
            ) : (
                <MaterialTable
                    materials={filteredMaterials}
                    onDownload={handleDownload}
                    onBookmark={handleBookmark}
                    onLike={handleLike}
                    bookmarkedMaterials={bookmarkedMaterials}
                    likedMaterials={likedMaterials}
                />
            )}

            {filteredMaterials.length === 0 && (
                <div className={`text-center py-12 ${styles.textSecondary}`}>
                    <p className="text-lg">No materials found matching your criteria.</p>
                    <p className="mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
    );
};

export default StudyMaterialsPage;