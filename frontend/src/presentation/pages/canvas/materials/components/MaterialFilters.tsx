import React from 'react';
import { FiFilter, FiChevronDown, FiX, FiSearch } from 'react-icons/fi';
import { usePreferences } from '../../../../context/PreferencesContext';
import { Material } from '../types/MaterialTypes';

interface MaterialFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCourse: string;
    setSelectedCourse: (course: string) => void;
    selectedType: string;
    setSelectedType: (type: string) => void;
    selectedSemester: string;
    setSelectedSemester: (semester: string) => void;
    selectedDifficulty: string;
    setSelectedDifficulty: (difficulty: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    materials: Material[];
}

const MaterialFilters: React.FC<MaterialFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedCourse,
    setSelectedCourse,
    selectedType,
    setSelectedType,
    selectedSemester,
    setSelectedSemester,
    selectedDifficulty,
    setSelectedDifficulty,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
    materials
}) => {
    const { styles } = usePreferences();

    // Extract materials from props structure and get unique values
    const extractedMaterials = materials.map(item => item.props || item);
    
    const courses = [...new Set(extractedMaterials.map(m => m.course))];
    const types = [...new Set(extractedMaterials.map(m => m.type))];
    const semesters = [...new Set(extractedMaterials.map(m => m.semester))];
    const difficulties = [...new Set(extractedMaterials.map(m => m.difficulty))];

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
        <div className={`${styles.card.background} rounded-2xl shadow-lg p-6 mb-8 ${styles.card.border}`}>
            <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                    <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.icon.secondary}`} size={20} />
                    <input
                        type="text"
                        placeholder="Search materials, courses, instructors, or tags..."
                        className={`w-full pl-12 pr-4 py-3 ${styles.input.border} rounded-xl ${styles.input.focus} ${styles.input.background} transition-all duration-200 text-lg`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search materials"
                    />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center px-6 py-3 ${styles.button.outline} rounded-xl transition-all duration-200 font-medium`}
                    aria-label="Toggle filters"
                >
                    <FiFilter size={18} className="mr-2" />
                    Filters
                    <FiChevronDown size={18} className={`ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Course</label>
                            <select
                                className={`w-full ${styles.input.border} rounded-lg px-3 py-2 ${styles.input.focus} ${styles.input.background}`}
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                aria-label="Filter by course"
                            >
                                <option value="">All Courses</option>
                                {courses.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Type</label>
                            <select
                                className={`w-full ${styles.input.border} rounded-lg px-3 py-2 ${styles.input.focus} ${styles.input.background}`}
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                aria-label="Filter by type"
                            >
                                <option value="">All Types</option>
                                {types.map(type => (
                                    <option key={type} value={type}>{type.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Semester</label>
                            <select
                                className={`w-full ${styles.input.border} rounded-lg px-3 py-2 ${styles.input.focus} ${styles.input.background}`}
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                aria-label="Filter by semester"
                            >
                                <option value="">All Semesters</option>
                                {semesters.sort((a, b) => a - b).map(semester => (
                                    <option key={semester} value={semester}>{getSemesterName(semester)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Difficulty</label>
                            <select
                                className={`w-full ${styles.input.border} rounded-lg px-3 py-2 ${styles.input.focus} ${styles.input.background}`}
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                aria-label="Filter by difficulty"
                            >
                                <option value="">All Levels</option>
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Sort By</label>
                            <select
                                className={`w-full ${styles.input.border} rounded-lg px-3 py-2 ${styles.input.focus} ${styles.input.background}`}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                aria-label="Sort materials"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="downloads">Most Downloaded</option>
                                <option value="views">Most Viewed</option>
                                <option value="rating">Highest Rated</option>
                                <option value="title">Alphabetical</option>
                            </select>
                        </div>
                    </div>

                    {(selectedCourse || selectedType || selectedSemester || selectedDifficulty) && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setSelectedCourse('');
                                    setSelectedType('');
                                    setSelectedSemester('');
                                    setSelectedDifficulty('');
                                }}
                                className={`flex items-center px-4 py-2 text-sm ${styles.button.outline} transition-colors`}
                                aria-label="Clear all filters"
                            >
                                <FiX size={16} className="mr-1" />
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MaterialFilters; 