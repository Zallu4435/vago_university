import { FiDollarSign, FiCreditCard, FiFileText, FiAward } from 'react-icons/fi';
import { Payment } from '../../domain/types/management/financialmanagement';

export const STATUSES = [
  'All Statuses',
  'Pending',
  'Completed',
  'Failed',
];
export const TERMS = ['All Terms', 'Fall 2024', 'Spring 2025', 'Summer 2025'];

export const paymentColumns = [
  {
    header: 'Student ID',
    key: 'studentId',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiCreditCard size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{payment.studentId}</span>
      </div>
    ),
    width: '15%',
  },
  {
    header: 'Date',
    key: 'date',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{new Date(payment.date).toLocaleDateString()}</span>
      </div>
    ),
  },
  {
    header: 'Method',
    key: 'method',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiCreditCard size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{payment.method}</span>
      </div>
    ),
  },
  {
    header: 'Amount',
    key: 'amount',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiDollarSign size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">${payment.amount.toFixed(2)}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (payment: Payment) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{payment.status}</span>
      </div>
    ),
  },
];

export const financialAidColumns = [
  {
    header: 'Student ID',
    key: 'studentId',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiCreditCard size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.studentId}</span>
      </div>
    ),
    width: '15%',
  },
  {
    header: 'Term',
    key: 'term',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.term}</span>
      </div>
    ),
  },
  {
    header: 'Type',
    key: 'type',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.type}</span>
      </div>
    ),
  },
  {
    header: 'Amount',
    key: 'amount',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiDollarSign size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">${app.amount.toFixed(2)}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.status}</span>
      </div>
    ),
  },
  {
    header: 'Date',
    key: 'applicationDate',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{new Date(app.applicationDate).toLocaleDateString()}</span>
      </div>
    ),
  },
];

export const scholarshipColumns = [
  {
    header: 'Student ID',
    key: 'studentId',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiCreditCard size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.studentId}</span>
      </div>
    ),
    width: '15%',
  },
  {
    header: 'Scholarship ID',
    key: 'scholarshipId',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiAward size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.scholarshipId}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{app.status}</span>
      </div>
    ),
  },
  {
    header: 'Date',
    key: 'applicationDate',
    render: (app: any) => (
      <div className="flex items-center text-gray-300">
        <FiFileText size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{new Date(app.applicationDate).toLocaleDateString()}</span>
      </div>
    ),
  },
]; 