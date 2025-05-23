import React, { useState, useEffect } from 'react';

// Mock data
const mockClubs = [
  {
    id: 'CLB001',
    name: 'Computer Science Society',
    category: 'Tech',
    createdBy: 'Admin John',
    createdDate: '2024-01-15',
    members: 45,
    status: 'Active'
  },
  {
    id: 'CLB002',
    name: 'Cultural Dance Club',
    category: 'Cultural',
    createdBy: 'Sarah Johnson',
    createdDate: '2024-02-20',
    members: 32,
    status: 'Active'
  },
  {
    id: 'CLB003',
    name: 'Basketball Team',
    category: 'Sports',
    createdBy: 'Mike Wilson',
    createdDate: '2024-03-10',
    members: 28,
    status: 'Inactive'
  },
  {
    id: 'CLB004',
    name: 'Photography Club',
    category: 'Arts',
    createdBy: 'Admin Emma',
    createdDate: '2024-01-30',
    members: 18,
    status: 'Active'
  }
];

const mockClubRequests = [
  {
    id: 'REQ001',
    clubName: 'Robotics Club',
    requestedBy: 'Alex Chen',
    category: 'Tech',
    reason: 'Want to create a space for robotics enthusiasts to collaborate on projects',
    requestedAt: '2024-05-20',
    status: 'Pending'
  },
  {
    id: 'REQ002',
    clubName: 'Debate Society',
    requestedBy: 'Maria Garcia',
    category: 'Academic',
    reason: 'Need a platform for students to practice public speaking and debate skills',
    requestedAt: '2024-05-18',
    status: 'Pending'
  }
];

const mockMemberRequests = [
  {
    id: 'MR001',
    studentName: 'John Doe',
    studentId: 'STU2023001',
    clubName: 'Computer Science Society',
    requestedAt: '2024-05-22',
    status: 'Pending'
  },
  {
    id: 'MR002',
    studentName: 'Jane Smith',
    studentId: 'STU2023002',
    clubName: 'Photography Club',
    requestedAt: '2024-05-21',
    status: 'Pending'
  }
];

const mockClubMembers = [
  {
    id: 'MEM001',
    name: 'Alice Johnson',
    studentId: 'STU2023015',
    joinDate: '2024-02-01',
    status: 'Approved'
  },
  {
    id: 'MEM002',
    name: 'Bob Wilson',
    studentId: 'STU2023016',
    joinDate: '2024-02-15',
    status: 'Approved'
  },
  {
    id: 'MEM003',
    name: 'Charlie Brown',
    studentId: 'STU2023017',
    joinDate: '2024-05-20',
    status: 'Pending'
  }
];

const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Arts', 'Academic'];

const AdminClubManagement = () => {
  const [activeTab, setActiveTab] = useState('clubs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [clubs, setClubs] = useState(mockClubs);
  const [clubRequests, setClubRequests] = useState(mockClubRequests);
  const [memberRequests, setMemberRequests] = useState(mockMemberRequests);
  const [toast, setToast] = useState(null);

  // Form state for adding/editing clubs
  const [clubForm, setClubForm] = useState({
    name: '',
    category: 'Tech',
    description: '',
    createdBy: 'Admin',
    status: 'Active'
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddClub = () => {
    const newClub = {
      id: `CLB${String(clubs.length + 1).padStart(3, '0')}`,
      name: clubForm.name,
      category: clubForm.category,
      createdBy: clubForm.createdBy,
      createdDate: new Date().toISOString().split('T')[0],
      members: 0,
      status: clubForm.status
    };
    setClubs([...clubs, newClub]);
    setShowAddModal(false);
    setClubForm({ name: '', category: 'Tech', description: '', createdBy: 'Admin', status: 'Active' });
    showToast('Club added successfully!');
  };

  const handleApproveRequest = (requestId) => {
    const request = clubRequests.find(r => r.id === requestId);
    if (request) {
      const newClub = {
        id: `CLB${String(clubs.length + 1).padStart(3, '0')}`,
        name: request.clubName,
        category: request.category,
        createdBy: request.requestedBy,
        createdDate: new Date().toISOString().split('T')[0],
        members: 0,
        status: 'Active'
      };
      setClubs([...clubs, newClub]);
      setClubRequests(clubRequests.filter(r => r.id !== requestId));
      showToast('Club request approved!');
    }
  };

  const handleRejectRequest = (requestId) => {
    setClubRequests(clubRequests.filter(r => r.id !== requestId));
    setShowRejectModal(false);
    setRejectReason('');
    showToast('Club request rejected', 'error');
  };

  const handleApproveMember = (requestId) => {
    setMemberRequests(memberRequests.map(r => 
      r.id === requestId ? { ...r, status: 'Approved' } : r
    ));
    showToast('Member approved!');
  };

  const handleRejectMember = (requestId) => {
    setMemberRequests(memberRequests.map(r => 
      r.id === requestId ? { ...r, status: 'Rejected' } : r
    ));
    showToast('Member rejected', 'error');
  };

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || club.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'Active') {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>● Active</span>;
    } else if (status === 'Inactive') {
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>● Inactive</span>;
    } else if (status === 'Pending') {
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>● Pending</span>;
    } else if (status === 'Approved') {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>● Approved</span>;
    } else if (status === 'Rejected') {
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>● Rejected</span>;
    }
  };

  const Toast = ({ message, type }) => (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? <span>✓</span> : <span>✗</span>}
        {message}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Club Management</h1>
        <p className="text-gray-600">Manage campus clubs and student memberships</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'clubs', label: 'All Clubs', count: clubs.length },
              { id: 'requests', label: 'Club Requests', count: clubRequests.length },
              { id: 'members', label: 'Membership Requests', count: memberRequests.filter(r => r.status === 'Pending').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by club name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-900 text-gray-300">{cat}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
            >
              <option value="All" className="bg-gray-900 text-gray-300">All Status</option>
              <option value="Active" className="bg-gray-900 text-gray-300">Active</option>
              <option value="Inactive" className="bg-gray-900 text-gray-300">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'clubs' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Club List</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <span>➕</span> Add New Club
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Club ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Club Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClubs.map(club => (
                  <tr key={club.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{club.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{club.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{club.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{club.createdBy}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{club.createdDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{club.members}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={club.status} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedClub(club);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          👁️
                        </button>
                        <button className="text-green-600 hover:text-green-800" title="Edit">
                          ✏️
                        </button>
                        <button className="text-red-600 hover:text-red-800" title="Delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredClubs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📋</div>
              <p className="text-gray-500">No clubs found matching your criteria</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Club Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Club Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested At</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clubRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{request.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{request.clubName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{request.requestedBy}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{request.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{request.requestedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                        >
                          ❌ Reject
                        </button>
                        <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200">
                          👁️ View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {clubRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <p className="text-gray-500">No pending club requests</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Membership Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Club Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested At</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {memberRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{request.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{request.studentName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{request.studentId}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{request.clubName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{request.requestedAt}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-4 py-3">
                      {request.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveMember(request.id)}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleRejectMember(request.id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Club Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Club</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                <input
                  type="text"
                  value={clubForm.name}
                  onChange={(e) => setClubForm({...clubForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={clubForm.category}
                  onChange={(e) => setClubForm({...clubForm, category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat} className="bg-gray-900 text-gray-300">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={clubForm.description}
                  onChange={(e) => setClubForm({...clubForm, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={clubForm.status}
                  onChange={(e) => setClubForm({...clubForm, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                >
                  <option value="Active" className="bg-gray-900 text-gray-300">Active</option>
                  <option value="Inactive" className="bg-gray-900 text-gray-300">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddClub}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Save Club
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Club Details Modal */}
      {showDetailsModal && selectedClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{selectedClub.name}</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Club Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Club ID:</span> {selectedClub.id}</p>
                  <p><span className="font-medium">Category:</span> {selectedClub.category}</p>
                  <p><span className="font-medium">Created By:</span> {selectedClub.createdBy}</p>
                  <p><span className="font-medium">Created Date:</span> {selectedClub.createdDate}</p>
                  <p><span className="font-medium">Status:</span> <StatusBadge status={selectedClub.status} /></p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Statistics</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Total Members:</span> {selectedClub.members}</p>
                  <p><span className="font-medium">Active Members:</span> {mockClubMembers.filter(m => m.status === 'Approved').length}</p>
                  <p><span className="font-medium">Pending Requests:</span> {mockClubMembers.filter(m => m.status === 'Pending').length}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Club Members</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Student Name</th>
                      <th className="px-4 py-2 text-left">Student ID</th>
                      <th className="px-4 py-2 text-left">Join Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockClubMembers.map(member => (
                      <tr key={member.id}>
                        <td className="px-4 py-2">{member.name}</td>
                        <td className="px-4 py-2">{member.studentId}</td>
                        <td className="px-4 py-2">{member.joinDate}</td>
                        <td className="px-4 py-2">
                          <StatusBadge status={member.status} />
                        </td>
                        <td className="px-4 py-2">
                          {member.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button className="text-red-600 hover:text-red-800 text-xs">
                                ❌ Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Club Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide a reason for rejecting this club request..."
              ></textarea>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleRejectRequest(clubRequests[0]?.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Reject Request
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a855f7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        select:focus {
          border-color: rgba(168, 85, 247, 0.5);
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.25);
        }

        select option {
          background-color: #1f2937;
          color: #e5e7eb;
        }

        select option:hover {
          background-color: #4b5563;
        }

        select:focus option:checked {
          background-color: #6b21a8;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AdminClubManagement;