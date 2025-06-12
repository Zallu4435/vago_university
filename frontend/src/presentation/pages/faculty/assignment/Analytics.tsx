import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Assignment, Submission } from './types';

export default function Analytics() {
  const [assignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Database Design Project',
      description: 'Design and implement a complete database system for a library management system.',
      dueDate: '2024-12-20',
      createdDate: '2024-11-15',
      totalStudents: 45,
      submitted: 38,
      reviewed: 25,
      late: 5,
      status: 'active',
      subject: 'Database Systems',
      maxMarks: 100
    },
    {
      id: 2,
      title: 'React Component Development',
      description: 'Create a set of reusable React components with proper documentation.',
      dueDate: '2024-12-15',
      createdDate: '2024-11-10',
      totalStudents: 45,
      submitted: 42,
      reviewed: 40,
      late: 3,
      status: 'active',
      subject: 'Web Development',
      maxMarks: 80
    }
  ]);

  const [submissions] = useState<Submission[]>([
    {
      id: 1,
      assignmentId: 1,
      studentName: 'John Doe',
      studentId: 'CS2021001',
      submittedDate: '2024-12-18',
      isLate: false,
      status: 'completed',
      marks: 85,
      feedback: 'Excellent work on the database design. Good use of normalization principles.',
      fileName: 'john_doe_db_project.zip',
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      assignmentId: 1,
      studentName: 'Jane Smith',
      studentId: 'CS2021002',
      submittedDate: '2024-12-21',
      isLate: true,
      status: 'pending',
      marks: null,
      feedback: '',
      fileName: 'jane_smith_db_project.zip',
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      assignmentId: 1,
      studentName: 'Mike Johnson',
      studentId: 'CS2021003',
      submittedDate: '2024-12-19',
      isLate: false,
      status: 'needs_revision',
      marks: 65,
      feedback: 'Good effort but needs improvement in query optimization. Please revise and resubmit.',
      fileName: 'mike_johnson_db_project.zip',
      fileSize: '3.1 MB'
    }
  ]);

  useEffect(() => {
    let submissionChart: Chart | null = null;
    let statusChart: Chart | null = null;

    const ctx = document.getElementById('submissionChart') as HTMLCanvasElement;
    if (ctx) {
      submissionChart = new Chart(ctx.getContext('2d')!, {
        type: 'bar',
        data: {
          labels: assignments.map(a => a.title),
          datasets: [{
            label: 'Submitted',
            data: assignments.map(a => a.submitted),
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
          }, {
            label: 'Reviewed',
            data: assignments.map(a => a.reviewed),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
          }, {
            label: 'Late',
            data: assignments.map(a => a.late),
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }

    const pieCtx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (pieCtx) {
      statusChart = new Chart(pieCtx.getContext('2d')!, {
        type: 'pie',
        data: {
          labels: ['Completed', 'Pending', 'Needs Revision'],
          datasets: [{
            data: [
              submissions.filter(s => s.status === 'completed').length,
              submissions.filter(s => s.status === 'pending').length,
              submissions.filter(s => s.status === 'needs_revision').length
            ],
            backgroundColor: [
              'rgba(16, 185, 129, 0.6)',
              'rgba(234, 179, 8, 0.6)',
              'rgba(239, 68, 68, 0.6)'
            ]
          }]
        },
        options: {
          responsive: true
        }
      });
    }

    return () => {
      if (submissionChart) submissionChart.destroy();
      if (statusChart) statusChart.destroy();
    };
  }, [assignments, submissions]);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Assignment Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Submission Overview</h3>
          <canvas id="submissionChart" className="w-full"></canvas>
        </div>
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Submission Status Distribution</h3>
          <canvas id="statusChart" className="w-full"></canvas>
        </div>
      </div>
      <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {((submissions.reduce((sum, s) => sum + (s.marks || 0), 0) / submissions.filter(s => s.marks).length) || 0).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">Average Marks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {(submissions.filter(s => s.status === 'completed').length / submissions.length * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Completion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {(submissions.filter(s => s.isLate).length / submissions.length * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Late Submission Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}