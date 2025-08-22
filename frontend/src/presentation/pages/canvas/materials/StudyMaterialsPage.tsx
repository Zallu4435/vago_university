import React, { useState, useEffect } from 'react';
import {
  FiGrid,
  FiList,
} from 'react-icons/fi';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import MaterialCard from './components/MaterialCard';
import MaterialTable from './components/MaterialTable';
import MaterialFilters from './components/MaterialFilters';
import { ViewMode, SortOption, Material } from '../../../../domain/types/canvas/materials';
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
  } = useStudyMaterials({
    course: selectedCourse,
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

  const handleDownload = async (material: Material): Promise<void> => {
    try {
      const materialData = material.props || material;
      await downloadMaterial(materialData.id);
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

  console.log(materials, 'materials');
  console.log(filteredMaterials, 'filteredMaterials');

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className={`hidden sm:block relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl bg-gradient-to-r ${styles.accent} group mb-4 sm:mb-6`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.primary}`}></div>
        <div className={`absolute -top-4 sm:-top-8 -left-4 sm:-left-8 w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-2xl sm:blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-4 sm:-bottom-8 -right-4 sm:-right-8 w-16 h-16 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-xl sm:blur-2xl animate-pulse delay-700`}></div>
        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FiGrid size={16} className="sm:w-5 sm:h-5 text-white relative z-10" />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-xl sm:rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div>
                <h1 className={`text-lg sm:text-2xl font-bold text-white bg-clip-text`}>
                  Study Materials
                </h1>
                <div className={`h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-16 sm:group-hover:w-24 transition-all duration-300`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
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
      </div>

      <div className="hidden sm:flex justify-end mb-4 sm:mb-6">
        <div className={`${styles.card.background} rounded-lg p-1 flex space-x-1 ${styles.card.border} shadow-sm hover:shadow-md transition-shadow duration-300`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? styles.button.primary : styles.button.secondary}`}
            aria-label="Grid view"
          >
            <FiGrid size={16} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${viewMode === 'table' ? styles.button.primary : styles.button.secondary}`}
            aria-label="Table view"
          >
            <FiList size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className={`${styles.textSecondary} text-sm sm:text-lg`}>Loading materials...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 sm:py-12">
          <p className={`${styles.textSecondary} text-sm sm:text-lg`}>{error.message || 'Failed to load materials'}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
          {filteredMaterials.map((material: Material) => (
            <MaterialCard
              key={material.id}
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
        <div className={`text-center py-8 sm:py-12 ${styles.textSecondary}`}>
          <p className="text-sm sm:text-lg">No materials found matching your criteria.</p>
          <p className="mt-2 text-xs sm:text-sm">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsPage;