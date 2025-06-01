import React, { useState, useEffect, useCallback } from 'react';
import { FiDollarSign, FiX, FiFileText, FiSearch } from 'react-icons/fi';
import { debounce } from 'lodash';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import { Charge } from '../../../../domain/types/financial';
import ReactDOM from 'react-dom';

interface ViewChargesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewChargesModal: React.FC<ViewChargesModalProps> = ({ isOpen, onClose }) => {
  const { getCharges } = useFinancial();
  const [searchQuery, setSearchQuery] = useState('');
  const [charges, setCharges] = useState<Charge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCharges, setFilteredCharges] = useState<Charge[]>([]);

  // Fetch charges when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCharges();
    }
  }, [isOpen]);

  // Update filtered charges when charges change
  useEffect(() => {
    setFilteredCharges(charges);
  }, [charges]);

  const fetchCharges = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedCharges = await getCharges({
        term: undefined,
        status: undefined,
        search: searchQuery,
        page: "1",
        limit: "10"
      });
      setCharges(fetchedCharges);
    } catch (error) {
      console.error('Error fetching charges:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getCharges, searchQuery]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      fetchCharges();
    }, 500),
    [fetchCharges]
  );

  console.log(charges)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const formattedDate = (date: string) => {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
  };

  // Initial fetch and cleanup
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      setSearchQuery('');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  // Particle effect
  const ghostParticles = Array(30)
    .fill(0)
    .map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animDuration: Math.random() * 10 + 15,
      animDelay: Math.random() * 5,
    }));

  const columns = [
    {
      header: 'Title',
      key: 'title',
      render: (charge: Charge) => (
        <div className="flex items-center text-purple-100">
          <FiFileText size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{charge.title}</span>
        </div>
      ),
    },
    {
      header: 'Description',
      key: 'description',
      render: (charge: Charge) => (
        <div className="flex items-center text-purple-100">
          <FiFileText size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{charge.description}</span>
        </div>
      ),
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (charge: Charge) => (
        <div className="flex items-center text-purple-100">
          <FiDollarSign size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">${charge.amount.toFixed(2)}</span>
        </div>
      ),
    },
    {
      header: 'Term',
      key: 'term',
      render: (charge: Charge) => (
        <div className="flex items-center text-purple-100">
          <FiFileText size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{charge.term}</span>
        </div>
      ),
    },
    {
      header: 'Due Date',
      key: 'dueDate',
      render: (charge: Charge) => (
        <div className="flex items-center text-purple-100">
          <FiFileText size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{new Date(charge.dueDate).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      header: 'Applicable For',
      key: 'applicableFor',
      render: (charge: Charge) => (
        <div className="flex items-center text-purple-100">
          <FiFileText size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{charge.applicableFor}</span>
        </div>
      ),
    },
    {
      header: 'Created At',
      key: 'createdAt',
      render: (charge: Charge) => (
        <div className="flex items-center text-purple-100">
          <FiFileText size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{formattedDate(charge.createdAt)}</span>
        </div>
      ),
    },
  ];


  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Background particles */}
      {ghostParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatParticle ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}


      {/* Main Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden relative z-[10000]">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border border-purple-500/30 bg-purple-600/20">
                <FiDollarSign size={24} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">View Charges</h2>
                <p className="text-purple-300 text-sm">Browse and search available charges</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <FiX size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          {/* Search Bar */}
          <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                <input
                  type="text"
                  onChange={handleSearchChange}
                  placeholder="Search by title or description..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/60 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Charges List
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredCharges.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-500/30">
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          className="py-3 px-4 text-left text-sm font-medium text-purple-300"
                        >
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCharges.map((charge) => (
                      <tr
                        key={charge.id}
                        className="border-b border-purple-500/20 hover:bg-gray-900/60 transition-colors"
                      >
                        {columns.map((col) => (
                          <td key={col.key} className="py-3 px-4">
                            {col.render(charge)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                  <FiDollarSign size={32} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-purple-100 mb-1">No Charges Found</h3>
                <p className="text-purple-300 text-center max-w-sm">
                  No charges match your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scroll {
          overflow: hidden;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(128, 90, 213, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>,
    document.body
  );
};

export default ViewChargesModal;