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
import { useStudyMaterials } from './hooks/useStudyMaterials';

const StudyMaterialsPage: React.FC = () => {
  const { styles } = usePreferences();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);

  const {
    materials,
    isLoading,
    error,
    getMaterials,
    downloadMaterial,
    toggleBookmark,
    toggleLike,
    isDownloading
  } = useStudyMaterials({
    subject: selectedCourse,
    type: selectedType,
    semester: selectedSemester,
    difficulty: selectedDifficulty,
    search: searchTerm,
    sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'oldest' ? 'createdAt' : sortBy,
    sortOrder: sortBy === 'newest' ? 'desc' : sortBy === 'oldest' ? 'asc' : 'asc'
  });

  useEffect(() => {
    if (shouldFetch) {
      getMaterials();
      setShouldFetch(false);
    }
  }, [shouldFetch, getMaterials]);

  const handleSync = () => {
    setShouldFetch(true);
  };

  const handleDownload = async (material: any): Promise<void> => {
    try {
      // Extract material data from props structure
      const materialData = material.props || material;
      await downloadMaterial(materialData._id);
    } catch (error) {
      console.error('Failed to download material:', error);
    }
  };

  const handleBookmark = async (materialId: string) => {
    try {
      await toggleBookmark(materialId);
    } catch (error) {
      console.error('Failed to bookmark material:', error);
    }
  };

  const handleLike = async (materialId: string) => {
    try {
      await toggleLike(materialId);
    } catch (error) {
      console.error('Failed to like material:', error);
    }
  };

  const filteredMaterials = materials;

  console.log(materials, "materials")
  console.log(filteredMaterials, "filtered matrial")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${styles.textPrimary}`}>Study Materials</h1>
        <button
          onClick={handleSync}
          className={`${styles.button.primary} px-4 py-2 rounded-lg flex items-center transition-all duration-200`}
        >
          <FiRefreshCw size={16} className="mr-2" />
          Sync
        </button>
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
        setSortBy={(sort: string) => setSortBy(sort as SortOption)}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        materials={materials}
      />

      <div className="flex justify-end mb-6">
        <div className={`${styles.card.background} rounded-lg p-1 flex space-x-1 ${styles.card.border}`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? styles.button.primary : styles.button.secondary}`}
            aria-label="Grid view"
          >
            <FiGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'table' ? styles.button.primary : styles.button.secondary}`}
            aria-label="Table view"
          >
            <FiList size={20} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className={`${styles.textSecondary} text-lg`}>Loading materials...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className={`${styles.textSecondary} text-lg`}>{error.message || 'Failed to load materials'}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
            <MaterialCard
              key={material._id}
              material={material}
              onDownload={handleDownload}
              onBookmark={handleBookmark}
              onLike={handleLike}
              isBookmarked={material.isBookmarked}
              isLiked={material.isLiked}
            />
          ))}
        </div>
      ) : (
        <MaterialTable
          materials={filteredMaterials}
          onDownload={handleDownload}
          onBookmark={handleBookmark}
          onLike={handleLike}
        />
      )}

      {!isLoading && !error && filteredMaterials.length === 0 && (
        <div className={`text-center py-12 ${styles.textSecondary}`}>
          <p className="text-lg">No materials found matching your criteria.</p>
          <p className="mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsPage;