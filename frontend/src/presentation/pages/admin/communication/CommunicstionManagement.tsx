import React, { useState, useCallback } from 'react';
import { 
  IoMailOutline as Mail,
  IoMailOpenOutline as Inbox,
  IoSendOutline as Send,
  IoCreateOutline as Edit,
  IoTrashOutline as Trash2,
  IoEyeOutline as Eye,
  IoReturnUpBackOutline as Reply,
  IoArchiveOutline as Archive,
  IoTimeOutline as Clock,
  IoCheckmarkCircleOutline as CheckCircle,
  IoEllipseOutline as Circle,
  IoAttachOutline as Paperclip,
  IoCloseOutline as X,
  IoPersonOutline as Users
} from 'react-icons/io5';
import { useCommunicationManagement } from '../../../../application/hooks/useCommunicationManagement';
import Header from '../User/Header';
import ApplicationsTable from '../User/ApplicationsTable';
import Pagination from '../User/Pagination';
import WarningModal from '../../../components/WarningModal';
import ComposeMessageModal from './ComposeMessageModal';
import MessageDetailsModal from './MessageDetailsModal';
import debounce from 'lodash/debounce';

interface Message {
  id: string;
  from?: string;
  email?: string;
  to?: string;
  subject: string;
  date: string;
  time: string;
  status: 'unread' | 'read' | 'delivered' | 'opened';
  content: string;
  thread?: { id: string; from: string; content: string; date: string; time: string }[];
  recipients?: number;
}

const STATUSES = ['All Statuses', 'Unread', 'Read', 'Delivered', 'Opened'];
const USER_GROUPS = [
  { value: 'all-students', label: 'All Students' },
  { value: 'all-faculty', label: 'All Faculty' },
  { value: 'all-staff', label: 'All Staff' },
  { value: 'freshman', label: 'Freshman Students' },
  { value: 'sophomore', label: 'Sophomore Students' },
  { value: 'junior', label: 'Junior Students' },
  { value: 'senior', label: 'Senior Students' },
  { value: 'individual', label: 'Individual User' },
];
const ITEMS_PER_PAGE = 10;

const inboxColumns = [
  {
    header: 'From',
    key: 'from',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Mail size={14} className="text-purple-400 mr-2" />
        <div>
          <p className={`text-sm ${message.status === 'unread' ? 'font-semibold text-gray-200' : 'text-gray-300'}`}>
            {message.from}
          </p>
          <p className="text-xs text-gray-400">{message.email}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Subject',
    key: 'subject',
    render: (message: Message) => (
      <div className="text-sm text-gray-300 truncate">{message.subject}</div>
    ),
  },
  {
    header: 'Date & Time',
    key: 'date',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Clock size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{`${message.date} ${message.time}`}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (message: Message) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          message.status === 'unread'
            ? 'bg-blue-900/30 text-blue-400 border-blue-500/30'
            : 'bg-green-900/30 text-green-400 border-green-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
      </span>
    ),
  },
];

const sentColumns = [
  {
    header: 'To',
    key: 'to',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Mail size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{message.to}</span>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Subject',
    key: 'subject',
    render: (message: Message) => (
      <div className="text-sm text-gray-300 truncate">{message.subject}</div>
    ),
  },
  {
    header: 'Date & Time',
    key: 'date',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Clock size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{`${message.date} ${message.time}`}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (message: Message) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          message.status === 'delivered'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-blue-900/30 text-blue-400 border-blue-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
      </span>
    ),
  },
  {
    header: 'Recipients',
    key: 'recipients',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{message.recipients || 1}</span>
      </div>
    ),
  },
];

const CommunicationManagement: React.FC = () => {
  const {
    // Data
    inboxMessages,
    sentMessages,
    totalInboxPages,
    totalSentPages,
    
    // Loading states
    isLoadingInbox,
    isLoadingSent,
    
    // State
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    
    // Handlers
    handleSendMessage,
    handleReplyMessage,
    handleDeleteMessage,
    handleArchiveMessage,
    handleViewMessage,
    fetchSentMessages,
  } = useCommunicationManagement();

  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  const handleViewMessageWithModal = (message: Message) => {
    setSelectedMessage(message);
    setShowMessageDetails(true);
    handleViewMessage(message);
  };

  const handleReplyMessageWithModal = (message: Message) => {
    setSelectedMessage(message);
    setShowComposeModal(true);
  };

  const handleDeleteMessageWithModal = (message: Message) => {
    setMessageToDelete(message);
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      handleDeleteMessage(messageToDelete._id, activeTab as 'inbox' | 'sent');
      setShowDeleteWarning(false);
      setMessageToDelete(null);
    }
  };

  const inboxActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Message',
      onClick: handleViewMessageWithModal,
      color: 'blue' as const,
    },
    {
      icon: <Reply size={16} />,
      label: 'Reply',
      onClick: handleReplyMessageWithModal,
      color: 'green' as const,
    },
    {
      icon: <Archive size={16} />,
      label: 'Archive',
      onClick: handleArchiveMessage,
      color: 'gray' as const,
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete',
      onClick: handleDeleteMessageWithModal,
      color: 'red' as const,
    },
  ];

  const sentActions = [
    {
      icon: <Eye size={16} />,
      label: 'View Message',
      onClick: handleViewMessageWithModal,
      color: 'blue' as const,
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete',
      onClick: handleDeleteMessageWithModal,
      color: 'red' as const,
    },
  ];

  // Handle tab changes
  const handleTabChange = (index: number) => {
    const tabMap = ['inbox', 'sent', 'compose'];
    const newTab = tabMap[index] as 'inbox' | 'sent' | 'compose';
    setActiveTab(newTab);
    setPage(1);

    // Only fetch sent messages when switching to sent tab
    if (newTab === 'sent') {
      fetchSentMessages();
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1);
    }, 500),
    []
  );

  // Debounced filter handler
  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters(prev => ({ ...prev, [field]: value }));
      setPage(1);
    }, 500),
    []
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
          title="Communication Management"
          subtitle="Manage all incoming and outgoing messages"
          stats={[
            {
              icon: <Inbox />,
              title: 'Unread Messages',
              value: inboxMessages.filter((m) => m.status === 'unread').length.toString(),
              change: '+2',
              isPositive: true,
            },
            {
              icon: <Send />,
              title: 'Sent Messages',
              value: sentMessages.length.toString(),
              change: '+1',
              isPositive: true,
            },
            {
              icon: <Users />,
              title: 'Total Recipients',
              value: sentMessages.reduce((sum, m) => sum + (m.recipients || 1), 0).toString(),
              change: '+1250',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'Inbox', icon: <Inbox size={16} />, active: activeTab === 'inbox' },
            { label: 'Sent', icon: <Send size={16} />, active: activeTab === 'sent' },
            { label: 'Compose', icon: <Edit size={16} />, active: activeTab === 'compose' },
          ]}
          searchQuery={searchTerm}
          setSearchQuery={debouncedSearch}
          searchPlaceholder="Search messages..."
          filters={filters}
          filterOptions={{
            status: STATUSES,
            from: ['All Senders', 'John Smith', 'Sarah Johnson', 'Mike Davis'],
            to: ['All Recipients', 'All Students', 'Sarah Johnson'],
          }}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={() => setFilters({ status: 'All Statuses', from: 'All Senders', to: 'All Recipients' })}
          onTabClick={handleTabChange}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'compose' ? (
                <button
                  onClick={() => setShowComposeModal(true)}
                  className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Edit size={16} />
                  Compose Message
                </button>
              ) : (
                <>
                  {activeTab === 'inbox' && !isLoadingInbox && inboxMessages.length > 0 && (
                    <>
                      <ApplicationsTable
                        data={inboxMessages}
                        columns={inboxColumns}
                        actions={inboxActions}
                      />
                      <Pagination
                        page={page}
                        totalPages={totalInboxPages}
                        itemsCount={inboxMessages.length}
                        itemName="messages"
                        onPageChange={setPage}
                        onFirstPage={() => setPage(1)}
                        onLastPage={() => setPage(totalInboxPages)}
                      />
                    </>
                  )}
                  {activeTab === 'sent' && !isLoadingSent && sentMessages.length > 0 && (
                    <>
                      <ApplicationsTable
                        data={sentMessages}
                        columns={sentColumns}
                        actions={sentActions}
                      />
                      <Pagination
                        page={page}
                        totalPages={totalSentPages}
                        itemsCount={sentMessages.length}
                        itemName="messages"
                        onPageChange={setPage}
                        onFirstPage={() => setPage(1)}
                        onLastPage={() => setPage(totalSentPages)}
                      />
                    </>
                  )}
                  {((activeTab === 'inbox' && !isLoadingInbox && inboxMessages.length === 0) ||
                    (activeTab === 'sent' && !isLoadingSent && sentMessages.length === 0)) && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                        <Mail size={32} className="text-purple-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1">No Messages Found</h3>
                      <p className="text-gray-400 text-center max-w-sm">
                        There are no messages matching your current filters. Try adjusting your search criteria.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compose Message Modal */}
      <ComposeMessageModal
        isOpen={showComposeModal}
        initialForm={
          selectedMessage
            ? {
                to: [{ value: selectedMessage.email!, label: selectedMessage.from! }],
                subject: `Re: ${selectedMessage.subject}`,
                message: '',
                attachments: [],
              }
            : { to: [], subject: '', message: '', attachments: [] }
        }
        userGroups={USER_GROUPS}
        onSend={(form) => {
          handleSendMessage(form);
          setShowComposeModal(false);
          setSelectedMessage(null);
        }}
        onCancel={() => {
          setShowComposeModal(false);
          setSelectedMessage(null);
        }}
      />

      {/* Message Details Modal */}
      <MessageDetailsModal
        isOpen={showMessageDetails}
        message={selectedMessage!}
        onReply={() => {
          handleReplyMessage(selectedMessage!);
          setShowMessageDetails(false);
        }}
        onArchive={() => {
          handleArchiveMessage(selectedMessage!);
          setShowMessageDetails(false);
        }}
        onDelete={() => {
          handleDeleteMessage(selectedMessage!._id, activeTab as 'inbox' | 'sent');
          setShowMessageDetails(false);
        }}
        onClose={() => {
          setShowMessageDetails(false);
          setSelectedMessage(null);
        }}
        messageType={activeTab as 'inbox' | 'sent'}
      />

      {/* Warning Modal */}
      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
          setMessageToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message={messageToDelete ? `Are you sure you want to delete the message "${messageToDelete.subject}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <style jsx>{`
        @keyframes floatingMist {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(15px);
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

export default CommunicationManagement;