export default function UniversityAdminDashboard() {
  const diplomaProgresses = [
    { course: 'Web Development', progress: 75 },
    { course: 'Web Development', progress: 60 },
    { course: 'Web Development', progress: 45 },
  ];

  const recentActivities = [
    { activity: 'New User Registered', time: '10 min ago' },
    { activity: 'New User Registered', time: '10 min ago' },
    { activity: 'New User Registered', time: '10 min ago' },
  ];

  const upcomingEvents = [
    { name: 'Upcoming Events', date: 'MAY 10 2025' },
    { name: 'Upcoming Events', date: 'MAY 10 2025' },
  ];

  return (
    <main className="flex-1 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 p-6 rounded">
            <h2 className="text-lg font-medium mb-2 text-center">Total Users</h2>
            <p className="text-3xl font-bold text-center">200</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Diploma Completion Progress */}
        <div className="col-span-2 bg-white border border-gray-200 p-6 rounded">
          <h2 className="text-lg font-medium mb-4">Diploma Completion Progress</h2>
          <div className="space-y-4">
            {diplomaProgresses.map((item, index) => (
              <div key={index}>
                <div className="flex items-center mb-1">
                  <span className="text-sm text-gray-700">{item.course}</span>
                </div>
                <div className="w-full bg-gray-200 rounded">
                  <div
                    className="bg-gray-300 rounded py-1"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white border border-gray-200 p-6 rounded">
          <h2 className="text-lg font-medium mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((item, index) => (
              <div key={index} className="pb-2">
                <p className="font-medium">{item.activity}</p>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-lg font-medium mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded p-4 flex justify-between items-center"
            >
              <span>{event.name}</span>
              <span>{event.date}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
