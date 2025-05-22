import React, { useState } from 'react';
import {
    FaUser,
    FaGraduationCap,
    FaCreditCard,
    FaShieldAlt,
    FaUserAlt,
  } from 'react-icons/fa';
  import {
    FiDownload,
    FiBell,
    FiHelpCircle,
    FiLogOut,
  } from 'react-icons/fi';

// Sidebar Component
export default function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
    const sidebarItems = [
        { id: 'profile', icon: FaUser, label: 'Profile', active: true },
        { id: 'academic', icon: FaGraduationCap, label: 'Academic Settings' },
        { id: 'offline', icon: FiDownload, label: 'Offline Learning' },
        { id: 'notifications', icon: FiBell, label: 'Notifications' },
        { id: 'financial', icon: FaCreditCard, label: 'Financial Info' },
        { id: 'security', icon: FaShieldAlt, label: 'Security' },
        { id: 'support', icon: FiHelpCircle, label: 'Support' }
      ];
    

  return (
    <div className="w-80 p-6 relative">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl h-full flex flex-col">
        {/* Header */}
        <div className="p-8 text-center border-b border-white/10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
            <FaGraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">EduPortal</h2>
          <p className="text-cyan-300 text-sm">Student Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <ul className="space-y-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white shadow-lg border border-cyan-400/30' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse rounded-2xl"></div>
                    )}
                    <Icon className={`w-5 h-5 mr-4 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-cyan-300' : 'group-hover:scale-105'}`} />
                    <span className="relative z-10 font-medium">{item.label}</span>
                    {isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-3 shadow-lg">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="User" className="w-full h-full rounded-full object-cover" />
              ) : (
                <FaUserAlt className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{user.firstName} {user.lastName}</p>
              <p className="text-cyan-300 text-xs">{user.email}</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all duration-300 border border-red-500/30">
            <FiLogOut className="w-4 h-4 mr-2" />
            <button className="text-sm font-medium" onClick={onLogout}>Logout</button>
          </button>
        </div>
      </div>
    </div>
  );
};