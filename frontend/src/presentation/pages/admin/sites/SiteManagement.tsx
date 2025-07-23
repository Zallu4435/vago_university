import React from 'react';
import { FiPlus, FiUser, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import Header from '../../../components/admin/management/Header';
import ApplicationsTable from '../../../components/admin/management/ApplicationsTable';
import Pagination from '../../../components/admin/management/Pagination';
import WarningModal from '../../../components/common/WarningModal';
import SiteSectionForm from './SiteSectionForm';
import SiteSectionViewModal from './SiteSectionViewModal';
import { useSiteManagement, SiteSectionKey } from '../../../../application/hooks/useSiteManagement';
import { SiteSection } from '../../../../application/services/siteManagement.service';
import { toast } from 'react-hot-toast';
import { SECTIONS, columnsMap } from '../../../../shared/constants/siteManagementConstants';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import ErrorMessage from '../../../../shared/components/ErrorMessage';
import EmptyState from '../../../../shared/components/EmptyState';


const convertToTableData = (sections: SiteSection[]) => {
  return sections.map(section => ({
    ...section,
    _id: section.id
  }));
};


const SiteManagement = () => {
  const [selected, setSelected] = React.useState<SiteSection | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [showView, setShowView] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [editData, setEditData] = React.useState<SiteSection | null>(null);
  const [filters, setFilters] = React.useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('');
  const [dateFilters, setDateFilters] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const categoryFilter = filters.category && filters.category !== 'all' ? filters.category : undefined;
  const dateRangeFilter = filters.dateRange && filters.dateRange !== 'all' ? filters.dateRange : undefined;
  const startDate = dateFilters.startDate || '';
  const endDate = dateFilters.endDate || '';

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, categoryFilter, dateRangeFilter, startDate, endDate]);

  const {
    activeTab,
    setActiveTab,
    page,
    setPage,
    selectedId,
    setSelectedId,
    sections,
    selectedSection,
    isLoading,
    error,
    createSection,
    updateSection,
    deleteSection,
    handleViewSection,
    handleEditSection,
  } = useSiteManagement(
    debouncedSearchQuery,
    categoryFilter,
    dateRangeFilter,
    startDate,
    endDate,
  );

  const section = SECTIONS.find(s => s.key === activeTab)!;

  const tableData = convertToTableData(sections || []);

  const filterOptions: { [key: string]: string[] } = {
    category: [
      'All Categories',
      'Events',
      'News',
      'Research',
      'Education',
      'Student Life',
      'Facilities',
      'Awards',
      'Technology',
      'Business',
      'Health Services',
      'Financial Services',
      'Academic Affairs',
      'Student Services',
      'Finance',
      'Human Resources',
      'IT Services',
      'Facilities Management',
      'Research & Development',
      'External Relations'
    ],
  };

  const handleDateFilterChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateFilters(prev => ({
      ...prev,
      [field]: value
    }));
    if (value) {
      setFilters(prev => ({ ...prev, dateRange: 'custom' }));
    }
  };

  const handleResetAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    setDateFilters({});
  };

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (item: SiteSection & { _id: string }) => {
    handleEditSection(item._id);
    setShowForm(true);
  };

  const handleView = (item: SiteSection & { _id: string }) => {
    handleViewSection(item._id);
    setShowView(true);
  };

  const handleDelete = (item: SiteSection & { _id: string }) => {
    const siteSection: SiteSection = {
      id: item._id,
      sectionKey: item.sectionKey,
      title: item.title,
      description: item.description,
      image: item.image,
      link: item.link,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
    setSelected(siteSection);
    setShowDelete(true);
  };

  const handleFormSuccess = async (formData: any) => {
    try {
      if (selectedId) {
        await updateSection.mutateAsync({ id: selectedId, data: { ...formData, sectionKey: activeTab } });
        toast.success('Section updated successfully!');
      } else {
        await createSection.mutateAsync({ ...formData, sectionKey: activeTab });
      }
      setShowForm(false);
      setSelectedId(null);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save section. Please try again.');
    }
  };

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteSection.mutateAsync(selected.id);
      setShowDelete(false);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const tableActions = [
    {
      icon: <FiEye size={16} />, label: 'View', color: 'blue' as const, onClick: handleView,
    },
    {
      icon: <FiEdit size={16} />, label: 'Edit', color: 'green' as const, onClick: handleEdit,
    },
    {
      icon: <FiTrash2 size={16} />, label: 'Delete', color: 'red' as const, onClick: handleDelete,
    },
  ];

  const stats = [
    {
      icon: section.icon,
      title: `Total ${section.label}`,
      value: sections?.length.toString() || '0',
      change: '+0%',
      isPositive: true,
    },
    {
      icon: <FiPlus size={16} />,
      title: 'Recently Added',
      value: sections?.length > 0 ? '1' : '0',
      change: '+0%',
      isPositive: true,
    },
    {
      icon: <FiUser size={16} />,
      title: 'Active',
      value: sections?.length > 0 ? sections.length.toString() : '0',
      change: '+0%',
      isPositive: true,
    },
  ];

  if (error) {
    return <ErrorMessage message={error.message || 'Failed to load data.'} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Header
          title="Site Management"
          subtitle="Manage homepage sections: Highlights, VAGO Now, Leadership"
          tabs={SECTIONS.map((tab, idx) => ({
            label: tab.label,
            icon: tab.icon,
            active: activeTab === tab.key
          }))}
          onTabClick={(index) => setActiveTab(SECTIONS[index].key as SiteSectionKey)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          debouncedFilterChange={(field, value) => setFilters(prev => ({ ...prev, [field]: value }))}
          handleResetFilters={handleResetAllFilters}
          filters={filters}
          filterOptions={filterOptions}
          customDateRange={{
            startDate: dateFilters.startDate || '',
            endDate: dateFilters.endDate || ''
          }}
          handleCustomDateChange={handleDateFilterChange}
          stats={stats}
        />
        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20 min-h-[300px] relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 z-20 rounded-xl">
                <LoadingSpinner />
              </div>
            )}
            <div className={`px-6 py-5 ${isLoading ? 'opacity-50 pointer-events-none select-none' : ''}`}>
              <button
                onClick={handleAdd}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiPlus size={16} />
                Add {section.label}
              </button>
              {tableData.length > 0 ? (
                <>
                  <ApplicationsTable
                    data={tableData}
                    columns={columnsMap[activeTab]}
                    actions={tableActions}
                  />
                  <Pagination
                    page={page}
                    totalPages={1}
                    itemsCount={tableData.length}
                    itemName={section.label.toLowerCase()}
                    onPageChange={setPage as unknown as () => void}
                  />
                </>
              ) : (
                <EmptyState
                  icon={section.icon}
                  title={`No ${section.label} Found`}
                  message={`There are no ${section.label.toLowerCase()} at the moment.`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {showForm && (
        <SiteSectionForm
          fields={section.fields}
          initialData={selectedSection || undefined}
          onClose={() => {
            setShowForm(false);
            setSelectedId(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
      {showView && selectedSection && (
        <SiteSectionViewModal
          fields={section.fields}
          data={selectedSection as Record<string, any>}
          onClose={() => {
            setShowView(false);
            setSelectedId(null);
          }}
        />
      )}
      <WarningModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title={`Delete ${section.label}`}
        message={`Are you sure you want to delete this ${section.label.toLowerCase()}?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default SiteManagement; 