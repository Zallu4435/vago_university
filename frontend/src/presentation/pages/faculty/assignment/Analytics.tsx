import { useEffect } from 'react';
import Chart from 'chart.js/auto';

interface AnalyticsProps {
    analytics: {
        totalAssignments: number;
        totalSubmissions: number;
        submissionRate: number;
        averageMarks: number;
        averageSubmissionTimeHours: number;
        submissionStatus: {
            reviewed: number;
            pending: number;
            needs_correction: number;
        };
        lateSubmissions: number;
        submissionsByDate: {
            date: string;
            count: number;
        }[];
        marksDistribution: {
            range: string;
            count: number;
        }[];
        subjectDistribution: {
            subject: string;
            assignments: number;
            submissions: number;
            submissionRate: number;
        }[];
    } | null;
    isLoading: boolean;
    onShow: () => void;
    onHide: () => void;
}

export default function Analytics({ analytics, isLoading, onShow, onHide }: AnalyticsProps) {
    useEffect(() => {
        onShow();
        return () => onHide();
    }, [onShow, onHide]);

    useEffect(() => {
        if (!analytics || isLoading) return;

        let submissionChart: Chart | null = null;
        let statusChart: Chart | null = null;
        let marksChart: Chart | null = null;
        let subjectChart: Chart | null = null;

        // Submission Status Chart
        const statusCtx = document.getElementById('statusChart') as HTMLCanvasElement;
        if (statusCtx) {
            statusChart = new Chart(statusCtx.getContext('2d')!, {
                type: 'pie',
                data: {
                    labels: ['Reviewed', 'Pending', 'Needs Correction'],
                    datasets: [{
                        data: [
                            analytics.submissionStatus.reviewed,
                            analytics.submissionStatus.pending,
                            analytics.submissionStatus.needs_correction
                        ],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.6)',
                            'rgba(234, 179, 8, 0.6)',
                            'rgba(239, 68, 68, 0.6)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Submission Status Distribution'
                        }
                    }
                }
            });
        }

        // Submissions by Date Chart
        const submissionCtx = document.getElementById('submissionChart') as HTMLCanvasElement;
        if (submissionCtx) {
            submissionChart = new Chart(submissionCtx.getContext('2d')!, {
                type: 'line',
                data: {
                    labels: analytics.submissionsByDate.map(d => d.date),
                    datasets: [{
                        label: 'Submissions',
                        data: analytics.submissionsByDate.map(d => d.count),
                        borderColor: 'rgba(99, 102, 241, 0.6)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Submissions Over Time'
                        }
                    }
                }
            });
        }

        // Marks Distribution Chart
        const marksCtx = document.getElementById('marksChart') as HTMLCanvasElement;
        if (marksCtx) {
            marksChart = new Chart(marksCtx.getContext('2d')!, {
                type: 'bar',
                data: {
                    labels: analytics.marksDistribution.map(m => m.range),
                    datasets: [{
                        label: 'Number of Submissions',
                        data: analytics.marksDistribution.map(m => m.count),
                        backgroundColor: 'rgba(99, 102, 241, 0.6)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Marks Distribution'
                        }
                    }
                }
            });
        }

        // Subject Distribution Chart
        const subjectCtx = document.getElementById('subjectChart') as HTMLCanvasElement;
        if (subjectCtx) {
            subjectChart = new Chart(subjectCtx.getContext('2d')!, {
                type: 'bar',
                data: {
                    labels: analytics.subjectDistribution.map(s => s.subject),
                    datasets: [{
                        label: 'Assignments',
                        data: analytics.subjectDistribution.map(s => s.assignments),
                        backgroundColor: 'rgba(99, 102, 241, 0.6)'
                    }, {
                        label: 'Submissions',
                        data: analytics.subjectDistribution.map(s => s.submissions),
                        backgroundColor: 'rgba(16, 185, 129, 0.6)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Subject-wise Distribution'
                        }
                    }
                }
            });
        }

        return () => {
            if (submissionChart) submissionChart.destroy();
            if (statusChart) statusChart.destroy();
            if (marksChart) marksChart.destroy();
            if (subjectChart) subjectChart.destroy();
        };
    }, [analytics, isLoading]);

    if (isLoading) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64 bg-gray-200 rounded"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Assignment Analytics</h2>
                <p className="text-gray-600">No analytics data available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Assignment Analytics</h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <p className="text-sm text-gray-600">Total Assignments</p>
                    <p className="text-2xl font-bold text-indigo-600">{analytics.totalAssignments}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <p className="text-sm text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-bold text-emerald-600">{analytics.totalSubmissions}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                    <p className="text-sm text-gray-600">Submission Rate</p>
                    <p className="text-2xl font-bold text-violet-600">
                        {typeof analytics.submissionRate === 'number' ? (analytics.submissionRate * 100).toFixed(1) : '0.0'}%
                    </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                    <p className="text-sm text-gray-600">Average Marks</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {typeof analytics.averageMarks === 'number' ? analytics.averageMarks.toFixed(1) : '0.0'}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <canvas id="submissionChart" className="w-full"></canvas>
                </div>
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <canvas id="statusChart" className="w-full"></canvas>
                </div>
                <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                    <canvas id="marksChart" className="w-full"></canvas>
                </div>
                <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                    <canvas id="subjectChart" className="w-full"></canvas>
                </div>
            </div>
        </div>
    );
}