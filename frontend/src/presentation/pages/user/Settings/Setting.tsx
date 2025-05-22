import { useState } from 'react';
import {
    FaGraduationCap,
    FaCreditCard,
    FaShieldAlt,
  } from 'react-icons/fa';
  import {
    FiDownload,
    FiBell,
    FiHelpCircle,
  } from 'react-icons/fi';
import ProfileSettings from './ProfileSettings';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/authSlice';

const UniversityDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.auth.user);
  
    const handleLogout = () => {
      console.log("Logging out...");
      dispatch(logout());
      navigate('/login')
    };
  
    const renderContent = () => {
      switch (activeTab) {
        case 'profile':
          return <ProfileSettings />;
        case 'academic':
          return (
            <div className="flex-1 p-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-full flex items-center justify-center">
                <div className="text-center">
                  <FaGraduationCap className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Academic Settings</h2>
                  <p className="text-gray-300">Coming soon...</p>
                </div>
              </div>
            </div>
          );
        case 'offline':
          return (
            <div className="flex-1 p-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-full flex items-center justify-center">
                <div className="text-center">
                  <FiDownload className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Offline Learning</h2>
                  <p className="text-gray-300">Coming soon...</p>
                </div>
              </div>
            </div>
          );
        case 'notifications':
          return (
            <div className="flex-1 p-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-full flex items-center justify-center">
                <div className="text-center">
                  <FiBell className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
                  <p className="text-gray-300">Coming soon...</p>
                </div>
              </div>
            </div>
          );
        case 'financial':
          return (
            <div className="flex-1 p-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-full flex items-center justify-center">
                <div className="text-center">
                  <FaCreditCard className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Financial Info</h2>
                  <p className="text-gray-300">Coming soon...</p>
                </div>
              </div>
            </div>
          );
        case 'security':
          return (
            <div className="flex-1 p-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-full flex items-center justify-center">
                <div className="text-center">
                  <FaShieldAlt className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Security</h2>
                  <p className="text-gray-300">Coming soon...</p>
                </div>
              </div>
            </div>
          );
        case 'support':
          return (
            <div className="flex-1 p-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-full flex items-center justify-center">
                <div className="text-center">
                  <FiHelpCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Support</h2>
                  <p className="text-gray-300">Coming soon...</p>
                </div>
              </div>
            </div>
          );
        default:
          return <ProfileSettings />;
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user} />
        {renderContent()}
      </div>
    );
  };
  
  export default UniversityDashboard;
  