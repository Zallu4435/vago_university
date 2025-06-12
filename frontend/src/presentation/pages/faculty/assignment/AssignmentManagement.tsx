import { useState, useEffect } from 'react';
import AssignmentList from './AssignmentList';
import Submissions from './Submissions';
import Analytics from './Analytics';
import CreateAssignmentModal from './CreateAssignmentModal';
import { Assignment, NewAssignment, Submission } from './types';
import ReviewModal from './ReviewModal';

export default function AssignmentManagement() {
    const [activeTab, setActiveTab] = useState('all-assignments');
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [newAssignment, setNewAssignment] = useState<NewAssignment>({
        title: '',
        subject: '',
        dueDate: '',
        maxMarks: '',
        description: '',
        files: []
    });
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    // Mock data for submissions
    const mockSubmissions: Submission[] = [
        {
            id: 1,
            assignmentId: 1,
            studentId: 'ST001',
            studentName: 'Alice Johnson',
            submittedDate: '2024-12-18T10:30:00Z',
            status: 'reviewed',
            marks: 85,
            feedback: 'Excellent work on the database design!',
            isLate: false,
            files: ['database_design.pdf'],
            fileName: 'database_design.pdf',
            fileSize: '2.3 MB'
        },
        {
            id: 2,
            assignmentId: 1,
            studentId: 'ST002',
            studentName: 'Bob Smith',
            submittedDate: '2024-12-19T15:45:00Z',
            status: 'pending',
            marks: null,
            feedback: '',
            isLate: true,
            files: ['db_project.zip'],
            fileName: 'db_project.zip',
            fileSize: '5.1 MB'
        },
        {
            id: 3,
            assignmentId: 1,
            studentId: 'ST003',
            studentName: 'Carol Davis',
            submittedDate: '2024-12-17T09:15:00Z',
            status: 'needs_correction',
            marks: 65,
            feedback: 'Good effort, but needs improvements in normalization.',
            isLate: false,
            files: ['library_db.sql'],
            fileName: 'library_db.sql',
            fileSize: '1.8 MB'
        }
    ];

    // Initialize submissions when an assignment is selected
    useEffect(() => {
        if (selectedAssignment) {
            // In a real application, you would fetch submissions from an API
            // For now, we'll use mock data
            setSubmissions(mockSubmissions.filter(sub => sub.assignmentId === selectedAssignment.id));
        }
    }, [selectedAssignment]);

    const handleReview = (submissionId: number, reviewData: { marks: number; feedback: string; status: 'reviewed' | 'pending' | 'needs_correction' }) => {
        setSubmissions(submissions.map(sub =>
            sub.id === submissionId ? { ...sub, ...reviewData } : sub
        ));
    };

    const handleDownload = (submissionId: number) => {
        const submission = submissions.find(s => s.id === submissionId);
        if (submission) {
            // Implement download logic here
            console.log('Downloading submission:', submission);
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        if (tabId === 'submissions' && !selectedAssignment) {
            // If no assignment is selected, show the assignment list first
            setActiveTab('all-assignments');
        }
    };

    const tabs = [
        { id: 'all-assignments', name: 'All Assignments', icon: '📚' },
        { id: 'submissions', name: 'Submissions', icon: '📝' },
        { id: 'analytics', name: 'Analytics', icon: '📊' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white text-2xl">📋</span>
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Assignment Management
                            </h1>
                            <p className="text-gray-600 text-sm">Manage and track student assignments efficiently</p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Navigation Tabs */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                    <div className="flex bg-gradient-to-r from-gray-50 to-gray-100/50">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex-1 px-8 py-6 text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${
                                    activeTab === tab.id
                                        ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg'
                                        : 'text-gray-600 hover:text-indigo-600 hover:bg-white/80'
                                }`}
                            >
                                <div className="flex items-center justify-center space-x-3 relative z-10">
                                    <span className="text-xl">{tab.icon}</span>
                                    <span>{tab.name}</span>
                                </div>
                                {activeTab === tab.id && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse opacity-20"></div>
                                )}
                                {activeTab !== tab.id && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content with Enhanced Animation */}
                    <div className="p-8">
                        <div className="transition-all duration-500 ease-in-out">
                            {activeTab === 'all-assignments' && (
                                <div className="animate-fadeIn">
                                    <AssignmentList
                                        setSelectedAssignment={(assignment) => {
                                            setSelectedAssignment(assignment);
                                            setActiveTab('submissions');
                                        }}
                                        setActiveTab={setActiveTab}
                                        setShowCreateModal={setShowCreateModal}
                                    />
                                </div>
                            )}
                            {activeTab === 'submissions' && selectedAssignment && (
                                <div className="animate-fadeIn">
                                    <Submissions
                                        assignment={selectedAssignment}
                                        submissions={submissions}
                                        onReview={(submissionId, reviewData) => {
                                            handleReview(submissionId, reviewData);
                                            setSelectedSubmission(reviewData.status === 'reviewed' ? submissions.find(s => s.id === submissionId) : null);
                                        }}
                                        onDownload={handleDownload}
                                        setShowReviewModal={setShowReviewModal}
                                    />
                                </div>
                            )}
                            {activeTab === 'analytics' && (
                                <div className="animate-fadeIn">
                                    <Analytics />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Floating Action Indicator */}
                {activeTab === 'all-assignments' && (
                    <div className="fixed bottom-8 right-8 z-50">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-1 shadow-2xl animate-pulse">
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
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && selectedSubmission && (
                <div className="fixed inset-0 z-[9999] animate-fadeIn">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="relative z-10 h-full flex items-center justify-center p-4">
                        <div className="transform animate-scaleIn w-full max-w-2xl">
                            <ReviewModal
                                submission={selectedSubmission}
                                saveReview={(submissionId, reviewData) => {
                                    handleReview(submissionId, reviewData);
                                    setShowReviewModal(false);
                                    setSelectedSubmission(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}