export default function ScholarshipsSection() {
    return (
      <>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-4 mb-4 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Scholarships</h3>
            <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-orange-800 mb-4">Scholarship Opportunities</h4>
          <p className="text-gray-600">Explore available scholarships and track your applications here.</p>
          <div className="mt-4">
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md">
              View Scholarships
            </button>
          </div>
        </div>
      </>
    );
  }