import React from 'react';
import { FiPlus, FiStar, FiZap, FiUser, FiEye, FiEdit, FiTrash2, FiLink, FiImage, FiAlignLeft } from 'react-icons/fi';
import Header from '../User/Header';
import ApplicationsTable from '../User/ApplicationsTable';
import Pagination from '../User/Pagination';
import WarningModal from '../../../components/WarningModal';
import SiteSectionForm from './components/SiteSectionForm';
import SiteSectionViewModal from './components/SiteSectionViewModal';
import { useSiteManagement, SiteSectionKey } from '../../../../application/hooks/useSiteManagement';
import { SiteSection } from '../../../../application/services/siteManagement.service';
import { toast } from 'react-hot-toast';

interface SectionField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}

interface Section {
  key: SiteSectionKey;
  label: string;
  icon: React.ReactNode;
  fields: SectionField[];
}

// Helper function to convert SiteSection to table-compatible format
const convertToTableData = (sections: SiteSection[]) => {
  return sections.map(section => ({
    ...section,
    _id: section.id
  }));
};

const SECTIONS: Section[] = [
  {
    key: 'highlights',
    label: 'Highlights',
    icon: <FiStar size={16} />,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter highlight title' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'General News, Research, Education, Events, Facilities, Student Life' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter highlight description' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'link', label: 'Link', type: 'text', placeholder: 'https://example.com' }
    ]
  },
  {
    key: 'vagoNow',
    label: 'VAGO Now',
    icon: <FiZap size={16} />,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter VAGO Now title' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'Events, Facilities, Research, Student Life, Financial Services, Business, Technology, Health Services' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter VAGO Now description' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'link', label: 'Link', type: 'text', placeholder: 'https://example.com' }
    ]
  },
  {
    key: 'leadership',
    label: 'Leadership',
    icon: <FiUser size={16} />,
    fields: [
      { name: 'title', label: 'Name', type: 'text', required: true, placeholder: 'Enter leader name' },
      { name: 'category', label: 'Department', type: 'text', required: true, placeholder: 'Academic Affairs, Student Services, Finance, Human Resources, IT Services, Facilities Management, Research & Development, External Relations' },
      { name: 'description', label: 'Position', type: 'textarea', required: true, placeholder: 'Enter position title' },
      { name: 'image', label: 'Photo', type: 'image' },
      { name: 'link', label: 'Link', type: 'text', placeholder: 'https://example.com' }
    ]
  }
];

// Date formatter function
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Unified columns for all sections
const createColumns = (sectionKey: SiteSectionKey) => [
  {
    header: 'Title',
    key: 'title',
    render: (item: SiteSection & { _id: string }) => (
      <div className="flex items-center text-gray-300">
        {sectionKey === 'highlights' && <FiStar size={14} className="text-purple-400 mr-2" />}
        {sectionKey === 'vagoNow' && <FiZap size={14} className="text-purple-400 mr-2" />}
        {sectionKey === 'leadership' && <FiUser size={14} className="text-purple-400 mr-2" />}
        <span className="text-sm">{item.title || 'N/A'}</span>
      </div>
    ),
    width: '25%',
  },
  {
    header: 'Category',
    key: 'category',
    render: (item: SiteSection & { _id: string }) => (
      <div className="flex items-center text-gray-300">
        <span className="text-sm bg-purple-900/30 px-2 py-1 rounded text-purple-300">
          {item.category || 'N/A'}
        </span>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Created',
    key: 'createdAt',
    render: (item: SiteSection & { _id: string }) => (
      <div className="flex items-center text-gray-300">
        <span className="text-sm">{formatDate(item.createdAt)}</span>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: (item: SiteSection & { _id: string }) => (
      <div className="flex items-center text-gray-300">
        <span className="text-sm">{formatDate(item.updatedAt)}</span>
      </div>
    ),
    width: '20%',
  },
];

const columnsMap: Record<SiteSectionKey, any[]> = {
  highlights: createColumns('highlights'),
  vagoNow: createColumns('vagoNow'),
  leadership: createColumns('leadership'),
};

const SiteManagement = () => {
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
    isLoadingSection,
    error,
    sectionError,
    createSection,
    updateSection,
    deleteSection,
    createHighlight,
    createVagoNow,
    createLeadership,
    handleViewSection,
    handleEditSection,
  } = useSiteManagement();

  const [selected, setSelected] = React.useState<SiteSection | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [showView, setShowView] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [editData, setEditData] = React.useState<SiteSection | null>(null);
  const [filters, setFilters] = React.useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dateFilters, setDateFilters] = React.useState<{ 
    startDate?: string; 
    endDate?: string; 
  }>({});

  const section = SECTIONS.find(s => s.key === activeTab)!;

  // Filtering logic
  const filteredData = sections?.filter(item => {
    // Global search
    if (searchQuery && !Object.values(item).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Field filters
    for (const key in filters) {
      if (filters[key] && String(item[key as keyof SiteSection] ?? '').toLowerCase() !== filters[key].toLowerCase()) {
        return false;
      }
    }
    
    // Date filters
    if (dateFilters.startDate || dateFilters.endDate) {
      const itemDate = new Date(item.createdAt);
      const startDate = dateFilters.startDate ? new Date(dateFilters.startDate) : null;
      const endDate = dateFilters.endDate ? new Date(dateFilters.endDate) : null;
      
      if (startDate && itemDate < startDate) {
        return false;
      }
      if (endDate && itemDate > endDate) {
        return false;
      }
    }
    
    return true;
  });

  // Convert to table-compatible format
  const tableData = convertToTableData(filteredData || []);

  // Filter options
  const filterOptions: { [key: string]: string[] } = {
    category: Array.from(new Set(sections?.map(item => item.category).filter((cat): cat is string => Boolean(cat)) || [])),
  };

  // Date filter handlers
  const handleDateFilterChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetDateFilters = () => {
    setDateFilters({});
  };

  // Combined reset function
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
    // Convert back to SiteSection format for delete
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

  // Unified form handling
  const handleFormSuccess = async (formData: any) => {
    try {
      console.log('Form Data:', formData); // Debug log
      if (selectedId) {
        await updateSection.mutateAsync({ id: selectedId, data: formData });
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

  // Unified delete handling
  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteSection.mutateAsync(selected.id);
      setShowDelete(false);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Action buttons for ApplicationsTable
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

  // Stats for the header
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
        <div className="text-red-500">Error: {error.message || 'Failed to load data.'}</div>
      </div>
    );
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
          onTabClick={(index) => setActiveTab(SECTIONS[index].key)}
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
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
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
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No {section.label} Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no {section.label.toLowerCase()} at the moment.
                  </p>
                </div>
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