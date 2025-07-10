import React, { useState } from 'react';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiFileText, FiVideo, FiUser, FiClock, FiLock, FiUnlock, FiTag } from 'react-icons/fi';
import { useMaterialManagement } from '../../../../application/hooks/useMaterialManagement';
import { debounce } from 'lodash';
import WarningModal from '../../../components/common/WarningModal';
import Header from '../../../components/admin/management/Header';
import Pagination from '../../../components/admin/management/Pagination';
import ApplicationsTable from '../../../components/admin/management/ApplicationsTable';
import MaterialForm from './MaterialForm';
import MaterialDetails from './MaterialDetails';
import { Material } from '../../../../domain/types/management/materialmanagement';
import {
  SUBJECTS,
  COURSES,
  SEMESTERS,
  TYPES,
  UPLOADERS,
  getMaterialColumns,
} from '../../../../shared/constants/materialManagementConstants';

const MaterialManagement: React.FC = () => {
  const {
    materials,
    totalPages,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    toggleRestrictionMaterial,
    materialDetails,
    isLoadingMaterialDetails,
    handleViewMaterial,
    handleEditMaterial,
    activeTab,
    handleTabChange,
  } = useMaterialManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showMaterialDetail, setShowMaterialDetail] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [materialToToggle, setMaterialToToggle] = useState<{ material: Material; isRestricted: boolean } | null>(null);
  const [showToggleWarning, setShowToggleWarning] = useState(false);

  // Get column definitions from constants
  const materialColumns = getMaterialColumns();

  const debouncedFilterChange = debounce((field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(1);
  }, 300);

  const handleResetFilters = () => {
    setFilters({
      subject: 'All Subjects',
      course: 'All Courses',
      semester: 'All Semesters',
      type: 'All Types',
      uploadedBy: 'All Uploaders',
    });
    setPage(1);
    setSearchTerm('');
  };

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setShowMaterialModal(true);
  };

  const handleSaveMaterial = async (formData: Partial<Material>) => {
    try {
      let dataToSend: any = formData;
      if (formData.file && formData.file instanceof File) {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'file' && value instanceof File) {
            fd.append('file', value);
          } else if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((v) => fd.append(key, v));
            } else {
              fd.append(key, value as any);
            }
          }
        });
        dataToSend = fd;
      }
      if (editingMaterial) {
        await updateMaterial({ id: editingMaterial.id, data: dataToSend });
      } else {
        await createMaterial(dataToSend);
      }
      setShowMaterialModal(false);
      setEditingMaterial(null);
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (materialToDelete) {
      await deleteMaterial(materialToDelete.id);
      setShowDeleteWarning(false);
      setMaterialToDelete(null);
    }
  };

  const handleConfirmToggle = async () => {
    if (materialToToggle) {
      await toggleRestrictionMaterial({ id: materialToToggle.material.id, isRestricted: materialToToggle.isRestricted });
      setShowToggleWarning(false);
      setMaterialToToggle(null);
    }
  };

  const materialActions = [
    {
      icon: <FiEye size={16} />,
      label: 'View Material',
      onClick: (material: Material) => {
        handleViewMaterial(material.id);
        setShowMaterialDetail(true);
      },
      color: 'blue' as const,
    },
    {
      icon: <FiEdit size={16} />,
      label: 'Edit Material',
      onClick: (material: Material) => {
        handleEditMaterial(material.id);
        setEditingMaterial(material);
        setShowMaterialModal(true);
      },
      color: 'green' as const,
    },
    {
      icon: <FiTrash2 size={16} />,
      label: 'Delete Material',
      onClick: (material: Material) => {
        setMaterialToDelete(material);
        setShowDeleteWarning(true);
      },
      color: 'red' as const,
    },
    {
      icon: (material: Material) => (material.isRestricted ? <FiUnlock size={16} /> : <FiLock size={16} />),
      label: (material: Material) => (material.isRestricted ? 'Unrestrict Material' : 'Restrict Material'),
      onClick: (material: Material) => {
        setMaterialToToggle({ material, isRestricted: !material.isRestricted });
        setShowToggleWarning(true);
      },
      color: 'yellow' as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 blur-md"
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatingMist ${Math.random() * 15 + 20}s ease-in-out infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Header
          title="Material Management"
          subtitle="Manage educational materials for courses"
          stats={[
            {
              icon: <FiFileText />,
              title: 'Total Materials',
              value: filteredMaterials.length.toString(),
              change: '+5.2%',
              isPositive: true,
            },
            {
              icon: <FiTag />,
              title: 'Restricted Materials',
              value: filteredMaterials.filter((m) => m.isRestricted).length.toString(),
              change: '+1.5%',
              isPositive: true,
            },
            {
              icon: <FiClock />,
              title: 'Avg. Views',
              value: Math.round(filteredMaterials.reduce((acc, m) => acc + m.views, 0) / (filteredMaterials.length || 1)).toString(),
              change: '+3.8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'All Materials', icon: <FiFileText size={16} />, active: activeTab === 'all' },
            { label: 'Restricted', icon: <FiLock size={16} />, active: activeTab === 'restricted' },
          ]}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          searchPlaceholder="Search materials..."
          filters={filters}
          filterOptions={{
            subject: SUBJECTS,
            course: COURSES,
            semester: SEMESTERS,
            type: TYPES,
            uploadedBy: UPLOADERS,
          }}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => handleTabChange(index === 0 ? 'all' : 'restricted')}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              <button
                onClick={handleAddMaterial}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiPlus size={16} />
                Add Material
              </button>

              {filteredMaterials.length > 0 ? (
                <>
                  <ApplicationsTable
                    data={filteredMaterials}
                    columns={materialColumns}
                    actions={materialActions}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    itemsCount={filteredMaterials.length}
                    itemName="materials"
                    onPageChange={(newPage) => setPage(newPage)}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <FiFileText size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Materials Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no materials matching your current filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMaterialModal && (
        <MaterialForm
          isOpen={showMaterialModal}
          onClose={() => setShowMaterialModal(false)}
          onSubmit={handleSaveMaterial}
          initialData={editingMaterial}
          isEditing={!!editingMaterial}
        />
      )}

      {showMaterialDetail && materialDetails && (
        <MaterialDetails
          isOpen={showMaterialDetail}
          onClose={() => setShowMaterialDetail(false)}
          material={materialDetails}
          isLoading={isLoadingMaterialDetails}
        />
      )}

      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Material"
        message={materialToDelete ? `Are you sure you want to delete "${materialToDelete.title}"? This action is permanent.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <WarningModal
        isOpen={showToggleWarning}
        onClose={() => setShowToggleWarning(false)}
        onConfirm={handleConfirmToggle}
        title={materialToToggle?.isRestricted ? 'Restrict Material' : 'Unrestrict Material'}
        message={
          materialToToggle
            ? `Are you sure you want to ${materialToToggle.isRestricted ? 'restrict' : 'unrestrict'} "${materialToToggle.material.title}"?`
            : ''
        }
        confirmText={materialToToggle?.isRestricted ? 'Restrict' : 'Unrestrict'}
        cancelText="Cancel"
        type="warning"
      />

      <style jsx>{`
        @keyframes floatingMist {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default MaterialManagement;