
import React from 'react';
import { FaTachometerAlt, FaChalkboardTeacher, FaCog, FaBell, FaUserAlt } from 'react-icons/fa';

export interface SearchResult {
    id: string;
    title: string;
    path: string;
    category: 'Dashboard' | 'Canvas';
    icon: React.ReactNode;
}

export interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    onLogout: () => void;
    userName?: string;
    profilePicture?: string;
}

export type DropdownAction = 'settings' | 'help' | 'logout';

export const searchableItems: SearchResult[] = [
    { id: 'dashboard', title: 'Dashboard', path: '/dashboard', category: 'Dashboard', icon: <FaTachometerAlt className="w-4 h-4" /> },
    { id: 'academics', title: 'Academics', path: '/dashboard/academics', category: 'Dashboard', icon: <FaChalkboardTeacher className="w-4 h-4" /> },
    { id: 'financial', title: 'Financial', path: '/dashboard/financial', category: 'Dashboard', icon: <FaCog className="w-4 h-4" /> },
    { id: 'communication', title: 'Communication', path: '/dashboard/communication', category: 'Dashboard', icon: <FaBell className="w-4 h-4" /> },
    { id: 'campus-life', title: 'Campus Life', path: '/dashboard/campus-life', category: 'Dashboard', icon: <FaUserAlt className="w-4 h-4" /> },

    { id: 'canvas-dashboard', title: 'Canvas Dashboard', path: '/canvas', category: 'Canvas', icon: <FaTachometerAlt className="w-4 h-4" /> },
    { id: 'diploma-course', title: 'Diploma Course', path: '/canvas/diploma-course', category: 'Canvas', icon: <FaChalkboardTeacher className="w-4 h-4" /> },
    { id: 'chat', title: 'Chat', path: '/canvas/chat', category: 'Canvas', icon: <FaBell className="w-4 h-4" /> },
    { id: 'video-class', title: 'Video Class', path: '/canvas/video-class', category: 'Canvas', icon: <FaCog className="w-4 h-4" /> },
    { id: 'materials', title: 'Materials', path: '/canvas/materials', category: 'Canvas', icon: <FaChalkboardTeacher className="w-4 h-4" /> },
    { id: 'assignments', title: 'Assignments', path: '/canvas/assignments', category: 'Canvas', icon: <FaCog className="w-4 h-4" /> },
];


