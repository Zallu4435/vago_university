import React, { useState, useMemo } from 'react';
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
    FiPlus
} from 'react-icons/fi';
import { usePreferences } from '../../../context/PreferencesContext';

interface Material {
    id: number;
    title: string;
    subject: string;
    course: string;
    semester: string;
    type: string;
    uploadedBy: string;
    uploadDate: string;
    downloads: number;
    views: number;
    fileSize: string;
    description: string;
    isNew: boolean;
    isRestricted: boolean;
    rating: number;
    tags: string[];
    thumbnail: string;
    difficulty: string;
    estimatedTime: string;
    isBookmarked: boolean;
    isLiked: boolean;
}

const StudyMaterialsPage = () => {
    const { styles } = usePreferences();
    const [materials] = useState<Material[]>([
        {
            id: 1,
            title: "Advanced Calculus - Differential Equations",
            subject: "Mathematics",
            course: "MATH 301",
            semester: "Fall 2024",
            type: "PDF",
            uploadedBy: "Dr. Sarah Johnson",
            uploadDate: "2024-05-15",
            downloads: 1245,
            views: 3420,
            fileSize: "2.4 MB",
            description: "Comprehensive notes covering partial differential equations, Laplace transforms, and real-world applications in engineering and physics.",
            isNew: true,
            isRestricted: false,
            rating: 4.8,
            tags: ["calculus", "differential-equations", "engineering"],
            thumbnail: "https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Math+Notes",
            difficulty: "Advanced",
            estimatedTime: "3-4 hours",
            isBookmarked: false,
            isLiked: false
        },
        {
            id: 2,
            title: "Organic Chemistry Lab Manual",
            subject: "Chemistry",
            course: "CHEM 205",
            semester: "Spring 2024",
            type: "PDF",
            uploadedBy: "Prof. Michael Chen",
            uploadDate: "2024-04-28",
            downloads: 892,
            views: 2156,
            fileSize: "5.1 MB",
            description: "Complete laboratory procedures, safety protocols, and experimental analysis for organic synthesis reactions.",
            isNew: false,
            isRestricted: false,
            rating: 4.6,
            tags: ["chemistry", "lab", "organic-synthesis"],
            thumbnail: "https://via.placeholder.com/300x200/fef3c7/d97706?text=Chemistry+Lab",
            difficulty: "Intermediate",
            estimatedTime: "2-3 hours",
            isBookmarked: true,
            isLiked: false
        },
        {
            id: 3,
            title: "Database Systems Interactive Presentation",
            subject: "Computer Science",
            course: "CS 401",
            semester: "Fall 2024",
            type: "PPT",
            uploadedBy: "Dr. Emily Rodriguez",
            uploadDate: "2024-05-20",
            downloads: 756,
            views: 1834,
            fileSize: "8.7 MB",
            description: "Interactive slides covering SQL optimization, database normalization, NoSQL systems, and modern cloud architectures.",
            isNew: true,
            isRestricted: true,
            rating: 4.9,
            tags: ["database", "sql", "nosql", "cloud"],
            thumbnail: "https://via.placeholder.com/300x200/dbeafe/3b82f6?text=Database+Systems",
            difficulty: "Advanced",
            estimatedTime: "4-5 hours",
            isBookmarked: false,
            isLiked: true
        },
        {
            id: 4,
            title: "Quantum Mechanics Problem Set Solutions",
            subject: "Physics",
            course: "PHYS 350",
            semester: "Fall 2024",
            type: "PDF",
            uploadedBy: "Dr. James Wilson",
            uploadDate: "2024-05-10",
            downloads: 634,
            views: 1298,
            fileSize: "1.8 MB",
            description: "Step-by-step solutions to quantum mechanics problems including wave functions, operators, and measurement theory.",
            isNew: false,
            isRestricted: true,
            rating: 4.7,
            tags: ["physics", "quantum", "problem-solving"],
            thumbnail: "https://via.placeholder.com/300x200/f3e8ff/8b5cf6?text=Quantum+Physics",
            difficulty: "Advanced",
            estimatedTime: "2-3 hours",
            isBookmarked: false,
            isLiked: false
        },
        {
            id: 5,
            title: "Business Analytics Dashboard Templates",
            subject: "Business",
            course: "BUS 210",
            semester: "Spring 2024",
            type: "XLS",
            uploadedBy: "Prof. Lisa Anderson",
            uploadDate: "2024-04-15",
            downloads: 1532,
            views: 4231,
            fileSize: "950 KB",
            description: "Professional Excel templates for financial modeling, KPI tracking, and data visualization with custom charts.",
            isNew: false,
            isRestricted: false,
            rating: 4.5,
            tags: ["business", "analytics", "excel", "templates"],
            thumbnail: "https://via.placeholder.com/300x200/ecfdf5/10b981?text=Business+Analytics",
            difficulty: "Beginner",
            estimatedTime: "1-2 hours",
            isBookmarked: true,
            isLiked: true
        },
        {
            id: 6,
            title: "Renaissance Art History Documentary",
            subject: "Art History",
            course: "ART 101",
            semester: "Fall 2024",
            type: "MP4",
            uploadedBy: "Dr. Maria Garcia",
            uploadDate: "2024-05-18",
            downloads: 432,
            views: 2143,
            fileSize: "245 MB",
            description: "HD documentary exploring Renaissance masterpieces, artistic techniques, and cultural context of the period.",
            isNew: true,
            isRestricted: false,
            rating: 4.4,
            tags: ["art", "history", "renaissance", "documentary"],
            thumbnail: "https://via.placeholder.com/300x200/fef7ed/ea580c?text=Art+History",
            difficulty: "Beginner",
            estimatedTime: "1.5 hours",
            isBookmarked: false,
            isLiked: false
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [bookmarkedMaterials, setBookmarkedMaterials] = useState<Set<number>>(new Set());
    const [likedMaterials, setLikedMaterials] = useState<Set<number>>(new Set());

    const courses = [...new Set(materials.map(m => m.course))];
    const types = [...new Set(materials.map(m => m.type))];
    const semesters = [...new Set(materials.map(m => m.semester))];
    const difficulties = [...new Set(materials.map(m => m.difficulty))];

    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'pdf': return <FiFileText className={styles.icon.primary} size={24} />;
            case 'doc': case 'docx': return <FiBookOpen className={styles.icon.primary} size={24} />;
            case 'ppt': case 'pptx': return <FiFileText className={styles.icon.primary} size={24} />;
            case 'xls': case 'xlsx': return <FiFileText className={styles.icon.primary} size={24} />;
            case 'jpg': case 'png': case 'gif': return <FiImage className={styles.icon.primary} size={24} />;
            case 'mp4': case 'avi': return <FiVideo className={styles.icon.primary} size={24} />;
            default: return <FiFile className={styles.icon.secondary} size={24} />;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return styles.status.success;
            case 'Intermediate': return styles.status.warning;
            case 'Advanced': return styles.status.error;
            default: return styles.status.info;
        }
    };

    const filteredMaterials = useMemo(() => {
        let filtered = materials.filter(material => {
            const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                material.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                material.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                material.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCourse = !selectedCourse || material.course === selectedCourse;
            const matchesType = !selectedType || material.type === selectedType;
            const matchesSemester = !selectedSemester || material.semester === selectedSemester;
            const matchesDifficulty = !selectedDifficulty || material.difficulty === selectedDifficulty;

            return matchesSearch && matchesCourse && matchesType && matchesSemester && matchesDifficulty;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
                case 'oldest':
                    return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
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
    }, [materials, searchTerm, selectedCourse, selectedType, selectedSemester, selectedDifficulty, sortBy]);

    const handleDownload = (material: Material) => {
        if (material.isRestricted) {
            alert('⚠️ This material requires special access. Please contact your instructor or check your enrollment status.');
            return;
        }
        alert(`📥 Downloading: ${material.title}\nSize: ${material.fileSize}`);
    };

    const handleBookmark = (materialId: number) => {
        const newBookmarks = new Set(bookmarkedMaterials);
        if (newBookmarks.has(materialId)) {
            newBookmarks.delete(materialId);
        } else {
            newBookmarks.add(materialId);
        }
        setBookmarkedMaterials(newBookmarks);
    };

    const handleLike = (materialId: number) => {
        const newLikes = new Set(likedMaterials);
        if (newLikes.has(materialId)) {
            newLikes.delete(materialId);
        } else {
            newLikes.add(materialId);
        }
        setLikedMaterials(newLikes);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    const MaterialCard = ({ material }: { material: Material }) => (
        <div className={`group rounded-2xl shadow-sm transition-all duration-300 ${styles.card.border} overflow-hidden transform hover:-translate-y-1 flex flex-col h-[600px] w-full ${styles.card.background} ${styles.card.hover}`}>
            <div className="relative h-48 aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                    src={material.thumbnail}
                    alt={material.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                    {material.isNew && (
                        <span className={`bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse`}>
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
                        onClick={() => handleBookmark(material.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${bookmarkedMaterials.has(material.id) || material.isBookmarked
                            ? `${styles.button.primary}`
                            : 'bg-black/20 text-white hover:bg-black/40'
                            }`}
                        aria-label={`Bookmark ${material.title}`}
                    >
                        <FiBookmark size={14} fill={bookmarkedMaterials.has(material.id) || material.isBookmarked ? "currentColor" : "none"} />
                    </button>
                </div>
                <div className="absolute bottom-3 left-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(material.difficulty)}`}>
                        {material.difficulty}
                    </span>
                </div>
                <div className="absolute bottom-3 right-3">
                    <div className={`bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center`}>
                        {getFileIcon(material.type)}
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
                        onClick={() => handleDownload(material)}
                        className={`flex-1 ${styles.button.primary} px-4 py-2.5 rounded-xl flex items-center justify-center font-medium transition-all duration-200`}
                        aria-label={`Download ${material.title}`}
                    >
                        <FiDownload size={16} className="mr-2" />
                        Download
                    </button>
                    <button
                        onClick={() => handleLike(material.id)}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${likedMaterials.has(material.id) || material.isLiked
                            ? `${styles.status.error} ${styles.button.primary}`
                            : `${styles.button.secondary}`
                            }`}
                        aria-label={`Like ${material.title}`}
                    >
                        <FiHeart size={16} fill={likedMaterials.has(material.id) || material.isLiked ? "currentColor" : "none"} />
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

    return (
        <div className={`min-h-screen ${styles.background}`}>
            <div className={`${styles.card.background} ${styles.border} shadow-sm py-8 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h1 className={`text-3xl sm:text-4xl font-bold ${styles.textPrimary} mb-2`}>
                                Study Materials
                            </h1>
                            <p className={`text-base ${styles.textSecondary} max-w-2xl`}>
                                Access and download educational resources for your courses
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className={`flex ${styles.button.secondary} rounded-lg p-1`}>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid'
                                            ? `${styles.button.primary}`
                                            : 'hover:bg-gray-100'
                                        }`}
                                    aria-label="Switch to grid view"
                                >
                                    <FiGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'table'
                                            ? `${styles.button.primary}`
                                            : 'hover:bg-gray-100'
                                        }`}
                                    aria-label="Switch to table view"
                                >
                                    <FiList size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                        <div className={`flex items-center ${styles.textTertiary}`}>
                            <FiTrendingUp size={16} className={`mr-2 ${styles.icon.primary}`} />
                            <span className="text-sm">
                                {materials.reduce((sum, m) => sum + m.downloads, 0).toLocaleString()} Downloads
                            </span>
                        </div>
                        <div className={`flex items-center ${styles.textTertiary}`}>
                            <FiUsers size={16} className={`mr-2 ${styles.icon.primary}`} />
                            <span className="text-sm">
                                {new Set(materials.map(m => m.uploadedBy)).size} Contributors
                            </span>
                        </div>
                        <div className={`flex items-center ${styles.textTertiary}`}>
                            <FiAward size={16} className={`mr-2 ${styles.icon.primary}`} />
                            <span className="text-sm">4.6 Avg Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className={`${styles.card.background} rounded-2xl shadow-lg p-6 mb-8 ${styles.card.border}`}>
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
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
                                            <option key={type} value={type}>{type}</option>
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
                                        {semesters.map(semester => (
                                            <option key={semester} value={semester}>{semester}</option>
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

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className={`text-lg font-medium ${styles.textPrimary}`}>
                            {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'} found
                        </p>
                        <p className={`text-sm ${styles.textSecondary}`}>
                            {materials.length} total materials available
                        </p>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMaterials.length === 0 ? (
                            <p className={`text-center ${styles.textSecondary} py-8 col-span-full`}>No materials found. Try adjusting your filters.</p>
                        ) : (
                            filteredMaterials.map(material => (
                                <MaterialCard key={material.id} material={material} />
                            ))
                        )}
                    </div>
                ) : (
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
                                    {filteredMaterials.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className={`py-8 text-center ${styles.textSecondary}`}>No materials found. Try adjusting your filters.</td>
                                        </tr>
                                    ) : (
                                        filteredMaterials.map(material => (
                                            <tr key={material.id} className={`hover:bg-gray-50/50 transition-colors duration-150`}>
                                                <td className="py-6 px-6 w-[30%]">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${styles.pattern.secondary} flex items-center justify-center`}>
                                                                {getFileIcon(material.type)}
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
                                                            onClick={() => handleBookmark(material.id)}
                                                            className={`p-2 rounded-lg transition-all duration-200 ${bookmarkedMaterials.has(material.id) || material.isBookmarked
                                                                ? `${styles.button.primary}`
                                                                : `${styles.button.secondary}`
                                                                }`}
                                                            aria-label={`Bookmark ${material.title}`}
                                                        >
                                                            <FiBookmark size={16} fill={bookmarkedMaterials.has(material.id) || material.isBookmarked ? "currentColor" : "none"} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleLike(material.id)}
                                                            className={`p-2 rounded-lg transition-all duration-200 ${likedMaterials.has(material.id) || material.isLiked
                                                                ? `${styles.status.error} ${styles.button.primary}`
                                                                : `${styles.button.secondary}`
                                                                }`}
                                                            aria-label={`Like ${material.title}`}
                                                        >
                                                            <FiHeart size={16} fill={likedMaterials.has(material.id) || material.isLiked ? "currentColor" : "none"} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(material)}
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
                )}
            </div>
        </div>
    );
};

export default StudyMaterialsPage;