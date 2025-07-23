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
  IoPersonOutline as Users,
} from 'react-icons/io5';
import { useCommunicationManagement } from '../../../../application/hooks/useCommunication';
import Header from '../../../components/admin/management/Header';
import ApplicationsTable from '../../../components/admin/management/ApplicationsTable';
import Pagination from '../../../components/admin/management/Pagination';
import WarningModal from '../../../components/common/WarningModal';
import ComposeMessageModal from './ComposeMessageModal'; // Shared with user side
import MessageDetailsModal from './MessageDetailsModal'; // Shared with user side
import debounce from 'lodash/debounce';
import { Message } from '../../../../domain/types/management/communicationmanagement';
import { STATUSES, USER_GROUPS, ITEMS_PER_PAGE, inboxColumns, sentColumns } from '../../../../shared/constants/communicationManagementConstants';

const CommunicationManagement: React.FC = () => {
  const {
    inboxMessages,
    sentMessages,
    totalInboxPages,
    totalSentPages,
    isLoadingInbox,
    isLoadingSent,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    handleSendMessage,
    handleReplyMessage,
    handleDeleteMessage,
    handleArchiveMessage,
    handleViewMessage,  
    fetchSentMessages,
    fetchUsers,
  } = useCommunicationManagement({ isAdmin: true }); // Pass isAdmin flag


  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  console.log(inboxMessages, "hahahahahhahah");
  console.log(sentMessages, "kokokokokok");

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
      handleDeleteMessage(messageToDelete.id, activeTab as 'inbox' | 'sent'); // Use id instead of _id
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

  const handleTabChange = (index: number) => {
    const tabMap = ['inbox', 'sent', 'compose'];
    const newTab = tabMap[index] as 'inbox' | 'sent' | 'compose';
    setActiveTab(newTab);
    setPage(1);

    if (newTab === 'sent') {
      fetchSentMessages();
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1);
    }, 500),
    []
  );

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
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
          title="Admin Communication Management"
          subtitle="Manage all incoming and outgoing messages for admin"
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
              value: 0,
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
            to: ['All Recipients', 'All Students', 'All Faculty', 'All Staff', 'Freshman Students', 'Sophomore Students', 'Junior Students', 'Senior Students', 'Individual User'],
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
                      <ApplicationsTable data={inboxMessages} columns={inboxColumns} actions={inboxActions} />
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
                      <ApplicationsTable data={sentMessages} columns={sentColumns} actions={sentActions} />
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

      <ComposeMessageModal
        isOpen={showComposeModal}
        initialForm={
          selectedMessage
            ? {
                to: [{ value: selectedMessage.sender.id, label: selectedMessage.sender.name }],
                subject: `Re: ${selectedMessage.subject}`,
                message: '',
                attachments: [],
                isAdmin: true
              }
            : { to: [], subject: '', message: '', attachments: [], isAdmin: true }
        }
        userGroups={USER_GROUPS}
        onSend={(form) => {
          handleSendMessage({ ...form, isAdmin: true });
          setShowComposeModal(false);
          setSelectedMessage(null);
        }}
        onCancel={() => {
          setShowComposeModal(false);
          setSelectedMessage(null);
        }}
        fetchUsers={fetchUsers}
      />

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
          handleDeleteMessage(selectedMessage!.id, activeTab as 'inbox' | 'sent'); // Use id instead of _id
          setShowMessageDetails(false);
        }}
        onClose={() => {
          setShowMessageDetails(false);
          setSelectedMessage(null);
        }}
        messageType={activeTab as 'inbox' | 'sent'}
      />

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