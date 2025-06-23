import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaFilter, FaTimes, FaUserTie, FaCalendar, FaTag, FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa';
import { useLeadership } from '../../../application/hooks/useSiteSections';
import { SiteSection } from '../../../application/services/siteSections.service';
import SiteSectionModal from '../../components/SiteSectionModal';

export const LeadershipPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLeader, setSelectedLeader] = useState<SiteSection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [allLeadership, setAllLeadership] = useState<SiteSection[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data: leadership, isLoading, error } = useLeadership(10, page);

  // Load more data when page changes
  useEffect(() => {
    if (leadership && Array.isArray(leadership)) {
      if (page === 1) {
        setAllLeadership(leadership);
      } else {
        setAllLeadership(prev => [...prev, ...leadership]);
      }
      setHasMore(leadership.length === 10); // If we get less than 10, we've reached the end
    }
  }, [leadership, page]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!allLeadership || !Array.isArray(allLeadership)) return [];
    const cats = allLeadership
      .map((leader: SiteSection) => leader.category)
      .filter((category): category is string => Boolean(category));
    return ['all', ...Array.from(new Set(cats))];
  }, [allLeadership]);

  // Filter leadership
  const filteredLeadership = useMemo(() => {
    if (!allLeadership || !Array.isArray(allLeadership)) return [];
    
    return allLeadership.filter((leader: SiteSection) => {
      const matchesSearch = leader.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           leader.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || leader.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [allLeadership, searchQuery, selectedCategory]);

  const handleLeaderClick = (leader: SiteSection) => {
    setSelectedLeader(leader);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLeader(null);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
      if (hasMore && !isLoading) {
        setPage(prev => prev + 1);
      }
    }
  }, [hasMore, isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Reset pagination when search/filter changes
  useEffect(() => {
    setPage(1);
    setAllLeadership([]);
    setHasMore(true);
  }, [searchQuery, selectedCategory]);

  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leadership information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-red-600">Failed to load leadership information. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-cyan-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              to="/"
              className="p-2 hover:bg-cyan-50 rounded-full transition-colors"
            >
              <FaArrowLeft className="text-cyan-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-cyan-800">University Leadership</h1>
              <p className="text-cyan-600">Meet our distinguished leaders and administrators</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leadership..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Positions' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredLeadership.length === 0 ? (
          <div className="text-center py-12">
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No leadership found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLeadership.map((leader) => (
                <div
                  key={leader.id}
                  onClick={() => handleLeaderClick(leader)}
                  className="group bg-white rounded-xl overflow-hidden border border-cyan-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={leader.image}
                      alt={leader.title}
                      className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        {leader.category || 'Leadership'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-600 transition-colors">
                      {leader.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {leader.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Joined: {new Date(leader.createdAt).toLocaleDateString()}</span>
                      <span className="text-cyan-600 font-medium">View Profile →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {isLoading && page > 1 && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading more leaders...</p>
              </div>
            )}

            {/* End of results indicator */}
            {!hasMore && filteredLeadership.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">You've reached the end of all leadership profiles</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <SiteSectionModal
        item={selectedLeader}
        isOpen={isModalOpen}
        onClose={closeModal}
        type="leadership"
      />
    </div>
  );
}; 