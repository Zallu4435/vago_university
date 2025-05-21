import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../pages/faculty/Sidebar';
import Header from '../pages/faculty/Header';

export default function FacultyLayout() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const facultyName = 'Prof. Johnson';
  const department = 'Computer Science';
  const currentDate = 'Thursday, May 16, 2025';

  return (
    <div className="flex min-h-screen bg-gray-50 box-border">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        facultyName={facultyName}
        department={department}
      />
      <div className="ml-72 w-[calc(100%-18rem)] min-h-screen bg-gray-50 box-border">
        <Header currentDate={currentDate} facultyName={facultyName} />
        <main className="px-8 pt-6 pb-12 mt-20">
          <Outlet context={{ activeTab, setActiveTab }} />
        </main>
      </div>
    </div>
  );
}