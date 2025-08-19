import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiX, FiSearch } from 'react-icons/fi';
import { Charge, ViewChargesModalProps } from '../../../../domain/types/management/financialmanagement';
import ReactDOM from 'react-dom';
import ChargeDetailsModal from './ChargeDetailsModal';
import { useChargesManagement } from '../../../../application/hooks/useFinancial';
import WarningModal from '../../../components/common/WarningModal';
import AddChargeModal from './AddChargeModal';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';
import { getChargeColumns, ghostParticles } from '../../../../shared/constants/paymentManagementConstants';

const ViewChargesModal: React.FC<ViewChargesModalProps> = ({ isOpen, onClose }) => {
  usePreventBodyScroll(isOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [chargeToDelete, setChargeToDelete] = useState<Charge | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [chargeToEdit, setChargeToEdit] = useState<Charge | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    charges,
    isLoading,
    updateCharge,
    deleteCharge,
  } = useChargesManagement(debouncedSearch, isOpen);

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

  const handleView = (charge: Charge) => {
    setSelectedCharge(charge);
    setIsDetailsModalOpen(true);
  };
  const handleEdit = (charge: Charge) => {
    setChargeToEdit(charge);
    setEditModalOpen(true);
  };
  const handleEditSubmit = (data: { title: string; description: string; amount: number; term: string; dueDate: string; applicableFor: string; }) => {
    if (chargeToEdit) {
      updateCharge({ id: chargeToEdit.id, data });
      setEditModalOpen(false);
      setChargeToEdit(null);
    }
  };
  const handleEditClose = () => {
    setEditModalOpen(false);
    setChargeToEdit(null);
  };
  const handleDelete = (charge: Charge) => {
    setChargeToDelete(charge);
    setWarningModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (chargeToDelete) {
      deleteCharge(chargeToDelete.id);
      setChargeToDelete(null);
      setWarningModalOpen(false);
    }
  };
  const handleCancelDelete = () => {
    setChargeToDelete(null);
    setWarningModalOpen(false);
  };

  const columns = getChargeColumns(handleView, handleEdit, handleDelete);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
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

      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden relative z-[10000]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

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

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/60 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Charges List
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : charges.length > 0 ? (
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
                    {charges.map((charge) => (
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
          {isDetailsModalOpen && selectedCharge && (
            <ChargeDetailsModal
              charge={selectedCharge}
              isOpen={isDetailsModalOpen}
              onClose={() => setIsDetailsModalOpen(false)}
            />
          )}
          <AddChargeModal
            isOpen={editModalOpen}
            onClose={handleEditClose}
            onSubmit={handleEditSubmit}
            {...(chargeToEdit && {
              initialValues: {
                title: chargeToEdit.title,
                description: chargeToEdit.description,
                amount: chargeToEdit.amount,
                term: chargeToEdit.term,
                dueDate: chargeToEdit.dueDate,
                applicableFor: chargeToEdit.applicableFor,
              },
            })}
          />
          <WarningModal
            isOpen={warningModalOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title="Delete Charge"
            message={`Are you sure you want to delete the charge "${chargeToDelete?.title}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            type="danger"
          />
        </div>
      </div>

      <style>{`
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