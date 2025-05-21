export default function AcademicsTabs({ activeSubTab, setActiveSubTab }) {
    const tabs = ['Course Registration', 'Academic Records', 'Degree Audit'];
  
    return (
      <div className="container mx-auto px-4 mt-6">
        <div className="flex bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-amber-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 py-3 px-4 font-medium text-center transition-all ${
                activeSubTab === tab
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-amber-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    );
  }