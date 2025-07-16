import { useState } from 'react';
import AssignmentList from './AssignmentList';
import Submissions from './Submissions';
import Analytics from './components/Analytics';
import CreateAssignmentModal from './CreateAssignmentModal';
import { useAssignmentManagement } from './hooks/useAssignmentManagement';
import { NewAssignment } from './types';

export default function AssignmentManagement() {
    const [activeTab, setActiveTab] = useState('all-assignments');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState<NewAssignment>({
        title: '',
        subject: '',
        dueDate: '',
        maxMarks: '',
        description: '',
        files: []
    });

    const {
        assignments,
        submissions,
        analytics,
        selectedAssignment,
        isLoading,
        error,
        setSelectedAssignment,
        setShowAnalytics,
        handleCreateAssignment,
        handleUpdateAssignment,
        handleDeleteAssignment,
        handleReviewSubmission,
        handleDownloadSubmission,
        isCreating,
        isUpdating,
        isDeleting,
        isReviewing
    } = useAssignmentManagement();

    const handleReview = async (submissionId: string, reviewData: { 
        marks: number; 
        feedback: string; 
        status: 'reviewed' | 'pending' | 'needs_correction';
        isLate: boolean;
    }) => {
        if (!selectedAssignment) return;
        await handleReviewSubmission(selectedAssignment._id, submissionId, reviewData);
    };

    const handleDownload = async (submissionId: string) => {
        if (!selectedAssignment) return;
        await handleDownloadSubmission(selectedAssignment._id, submissionId);
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        if (tabId === 'submissions' && !selectedAssignment) {
            setActiveTab('all-assignments');
        }
        if (tabId === 'analytics') {
            setShowAnalytics(true);
        } else {
            setShowAnalytics(false);
        }
    };

    const tabs = [
        { id: 'all-assignments', name: 'All Assignments', icon: '📚' },
        { id: 'submissions', name: 'Submissions', icon: '📝' },
        { id: 'analytics', name: 'Analytics', icon: '📊' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-2 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="inline-flex items-center space-x-3 bg-white/95 backdrop-blur-xl rounded-3xl px-8 py-6 shadow-2xl border border-pink-100">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-3xl">📋</span>
                        </div>
                        <div className="text-left">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Assignment Management
                            </h1>
                      <p className="text-pink-600 text-sm">Manage and track student assignments efficiently</p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Navigation Tabs */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-pink-100">
                        <div className="flex space-x-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                          className={`px-5 py-2 rounded-2xl text-base font-semibold transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-pink-700 hover:bg-pink-50 hover:text-pink-600'}
                          `}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="transition-all duration-500 ease-in-out">
                            {activeTab === 'all-assignments' && (
                                <div className="animate-fadeIn">
                                    <AssignmentList
                                        assignments={assignments}
                                        isLoading={isLoading}
                                        error={error}
                                        setSelectedAssignment={setSelectedAssignment}
                                        setActiveTab={setActiveTab}
                                        setShowCreateModal={setShowCreateModal}
                                        onDelete={handleDeleteAssignment}
                                        isDeleting={isDeleting}
                                        onUpdate={handleUpdateAssignment}
                                        isUpdating={isUpdating}
                                    />
                                </div>
                            )}
                            {activeTab === 'submissions' && selectedAssignment && (
                                <div className="animate-fadeIn">
                                    <Submissions
                                        assignment={selectedAssignment}
                                        submissions={submissions}
                                        onReview={handleReview}
                                        onDownload={handleDownload}
                                        setShowReviewModal={() => {}}
                                        isLoading={isLoading}
                                        isReviewing={isReviewing}
                                    />
                                </div>
                            )}
                            {activeTab === 'analytics' && (
                                <div className="animate-fadeIn">
                                    <Analytics
                                        analytics={analytics}
                                        isLoading={isLoading}
                                        onShow={() => setShowAnalytics(true)}
                                        onHide={() => setShowAnalytics(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Floating Action Indicator */}
                {activeTab === 'all-assignments' && (
                    <div className="fixed bottom-8 right-8 z-50">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 shadow-2xl animate-pulse">
                            <div className="bg-white rounded-full p-3">
                                <span className="text-2xl">✨</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[9999] animate-fadeIn">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="relative z-10 h-full flex items-center justify-center p-4">
                        <div className="transform animate-scaleIn">
                            <CreateAssignmentModal
                                newAssignment={newAssignment}
                                setNewAssignment={setNewAssignment}
                                setShowCreateModal={setShowCreateModal}
                                onSubmit={handleCreateAssignment}
                                isLoading={isCreating}
                                selectedAssignment={selectedAssignment}
                                onUpdate={handleUpdateAssignment}
                                setActiveTab={setActiveTab}
                                setSelectedAssignment={setSelectedAssignment}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}