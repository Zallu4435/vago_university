import { useEffect } from 'react';
import Chart from 'chart.js/auto';

interface AnalyticsProps {
    analytics: {
        totalAssignments: number;
        totalSubmissions: number;
        submissionRate: number;
        averageSubmissionTimeHours: number;
        subjectDistribution: {
            [key: string]: {
                count: number;
                submissions: number;
            };
        };
        statusDistribution: {
            [key: string]: {
                count: number;
                submissions: number;
            };
        };
        recentSubmissions: Array<{
            assignmentTitle: string;
            studentName: string;
            submittedAt: Date;
            score: number;
        }>;
        topPerformers: Array<{
            studentId: string;
            studentName: string;
            averageScore: number;
            submissionsCount: number;
        }>;
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

        let subjectChart: Chart | null = null;
        let statusChart: Chart | null = null;
        let recentSubmissionsChart: Chart | null = null;
        let topPerformersChart: Chart | null = null;

        // Subject Distribution Chart
        const subjectCtx = document.getElementById('subjectChart') as HTMLCanvasElement;
        if (subjectCtx) {
            const subjects = Object.keys(analytics.subjectDistribution);
            const counts = subjects.map(subject => analytics.subjectDistribution[subject].count);
            const submissions = subjects.map(subject => analytics.subjectDistribution[subject].submissions);

            subjectChart = new Chart(subjectCtx.getContext('2d')!, {
                type: 'bar',
                data: {
                    labels: subjects,
                    datasets: [
                        {
                            label: 'Assignments',
                            data: counts,
                            backgroundColor: 'rgba(99, 102, 241, 0.6)'
                        },
                        {
                            label: 'Submissions',
                            data: submissions,
                            backgroundColor: 'rgba(16, 185, 129, 0.6)'
                        }
                    ]
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

        // Status Distribution Chart
        const statusCtx = document.getElementById('statusChart') as HTMLCanvasElement;
        if (statusCtx) {
            const statuses = Object.keys(analytics.statusDistribution);
            const counts = statuses.map(status => analytics.statusDistribution[status].count);
            const submissions = statuses.map(status => analytics.statusDistribution[status].submissions);

            statusChart = new Chart(statusCtx.getContext('2d')!, {
                type: 'bar',
                data: {
                    labels: statuses.map(status => status.charAt(0).toUpperCase() + status.slice(1)),
                    datasets: [
                        {
                            label: 'Assignments',
                            data: counts,
                            backgroundColor: 'rgba(99, 102, 241, 0.6)'
                        },
                        {
                            label: 'Submissions',
                            data: submissions,
                            backgroundColor: 'rgba(16, 185, 129, 0.6)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Assignment Status Distribution'
                        }
                    }
                }
            });
        }

        // Recent Submissions Chart
        const recentSubmissionsCtx = document.getElementById('recentSubmissionsChart') as HTMLCanvasElement;
        if (recentSubmissionsCtx && analytics.recentSubmissions.length > 0) {
            recentSubmissionsChart = new Chart(recentSubmissionsCtx.getContext('2d')!, {
                type: 'bar',
                data: {
                    labels: analytics.recentSubmissions.map(s => s.studentName),
                    datasets: [{
                        label: 'Score',
                        data: analytics.recentSubmissions.map(s => s.score),
                        backgroundColor: 'rgba(16, 185, 129, 0.6)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Recent Submissions'
                        }
                    }
                }
            });
        }

        // Top Performers Chart
        const topPerformersCtx = document.getElementById('topPerformersChart') as HTMLCanvasElement;
        if (topPerformersCtx && analytics.topPerformers.length > 0) {
            topPerformersChart = new Chart(topPerformersCtx.getContext('2d')!, {
                type: 'bar',
                data: {
                    labels: analytics.topPerformers.map(p => p.studentName),
                    datasets: [{
                        label: 'Average Score',
                        data: analytics.topPerformers.map(p => p.averageScore),
                        backgroundColor: 'rgba(99, 102, 241, 0.6)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Top Performers'
                        }
                    }
                }
            });
        }

        return () => {
            if (subjectChart) subjectChart.destroy();
            if (statusChart) statusChart.destroy();
            if (recentSubmissionsChart) recentSubmissionsChart.destroy();
            if (topPerformersChart) topPerformersChart.destroy();
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
                    <p className="text-2xl font-bold text-violet-600">{analytics.submissionRate.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                    <p className="text-sm text-gray-600">Avg. Submission Time</p>
                    <p className="text-2xl font-bold text-yellow-600">{analytics.averageSubmissionTimeHours.toFixed(1)}h</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <canvas id="subjectChart" className="w-full"></canvas>
                </div>
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <canvas id="statusChart" className="w-full"></canvas>
                </div>
                {analytics.recentSubmissions.length > 0 && (
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                        <canvas id="recentSubmissionsChart" className="w-full"></canvas>
                    </div>
                )}
                {analytics.topPerformers.length > 0 && (
                    <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                        <canvas id="topPerformersChart" className="w-full"></canvas>
                    </div>
                )}
            </div>
        </div>
    );
} 