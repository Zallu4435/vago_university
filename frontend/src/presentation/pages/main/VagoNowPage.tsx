import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaFilter, FaTimes, FaBolt, FaCalendar, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { useVagoNow } from '../../../application/hooks/useSiteSections';
import { SiteSection } from '../../../application/services/siteSections.service';
import SiteSectionModal from '../../components/SiteSectionModal';

export const VagoNowPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<SiteSection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<SiteSection[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data: vagoNowItems, isLoading, error } = useVagoNow(10, page);

  // Load more data when page changes
  useEffect(() => {
    if (vagoNowItems && Array.isArray(vagoNowItems)) {
      if (page === 1) {
        setAllItems(vagoNowItems);
      } else {
        setAllItems(prev => [...prev, ...vagoNowItems]);
      }
      setHasMore(vagoNowItems.length === 10); // If we get less than 10, we've reached the end
    }
  }, [vagoNowItems, page]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!allItems || !Array.isArray(allItems)) return [];
    const cats = allItems
      .map((item: SiteSection) => item.category)
      .filter((category): category is string => Boolean(category));
    return ['all', ...Array.from(new Set(cats))];
  }, [allItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!allItems || !Array.isArray(allItems)) return [];
    
    return allItems.filter((item: SiteSection) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [allItems, searchQuery, selectedCategory]);

  const handleItemClick = (item: SiteSection) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
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
    setAllItems([]);
    setHasMore(true);
  }, [searchQuery, selectedCategory]);

  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading VAGO Now content...</p>
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
            <p className="text-red-600">Failed to load VAGO Now content. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-20">
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
              <h1 className="text-3xl font-bold text-cyan-800">VAGO Now</h1>
              <p className="text-cyan-600">Discover our exciting and vibrant campus life</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search VAGO Now..."
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
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No content found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item: SiteSection) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/90 via-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="text-xs font-semibold px-3 py-1 bg-cyan-500/80 rounded-full mb-2 inline-block">
                        {item.category || 'General'}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-cyan-100 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cyan-200">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-cyan-300 font-medium">Learn More →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {isLoading && page > 1 && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading more content...</p>
              </div>
            )}

            {/* End of results indicator */}
            {!hasMore && filteredItems.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">You've reached the end of all content</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <SiteSectionModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={closeModal}
        type="vagoNow"
      />
    </div>
  );
}; 