import React, { useState, useMemo } from 'react';
import { LuSearch, LuCalendar, LuFilter } from 'react-icons/lu';

interface AttendanceRecord {
  id: string;
  name: string;
  joinTime: string;
  leaveTime: string;
  status: 'Present' | 'Absent' | 'Late';
  date: string;
}

const dummyAttendance: AttendanceRecord[] = [
  { id: '1', name: 'Alice Johnson', joinTime: '09:00', leaveTime: '10:00', status: 'Present', date: '2024-05-20' },
  { id: '2', name: 'Bob Smith', joinTime: '09:10', leaveTime: '10:00', status: 'Late', date: '2024-05-20' },
  { id: '3', name: 'Charlie Brown', joinTime: '-', leaveTime: '-', status: 'Absent', date: '2024-05-20' },
  { id: '4', name: 'Diana Prince', joinTime: '09:00', leaveTime: '09:50', status: 'Present', date: '2024-05-20' },
  { id: '5', name: 'Eve Adams', joinTime: '09:20', leaveTime: '10:00', status: 'Late', date: '2024-05-20' },
  { id: '6', name: 'Frank Miller', joinTime: '09:00', leaveTime: '10:00', status: 'Present', date: '2024-05-19' },
  { id: '7', name: 'Grace Lee', joinTime: '-', leaveTime: '-', status: 'Absent', date: '2024-05-19' },
];

const statusOptions = ['All', 'Present', 'Absent', 'Late'] as const;

type StatusFilter = typeof statusOptions[number];

export const AttendanceManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('All');
  const [date, setDate] = useState('2024-05-20');

  const filtered = useMemo(() => {
    return dummyAttendance.filter((r) =>
      (status === 'All' || r.status === status) &&
      (search === '' || r.name.toLowerCase().includes(search.toLowerCase())) &&
      (date === '' || r.date === date)
    );
  }, [search, status, date]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Attendance Management</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search student..."
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <LuCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div className="relative">
            <LuFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="pl-10 pr-6 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
              value={status}
              onChange={e => setStatus(e.target.value as StatusFilter)}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Join Time</th>
              <th className="px-4 py-2 text-left">Leave Time</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">No records found.</td>
              </tr>
            ) : (
              filtered.map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{record.name}</td>
                  <td className="px-4 py-2">{record.joinTime}</td>
                  <td className="px-4 py-2">{record.leaveTime}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        record.status === 'Present'
                          ? 'text-green-600 font-semibold'
                          : record.status === 'Late'
                          ? 'text-yellow-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">{record.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 