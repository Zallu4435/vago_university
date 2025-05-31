export default function AcademicsTabs({ activeSubTab, setActiveSubTab }) {
  const tabs = ['Course Registration', 'Academic Records', 'Degree Audit'];

  return (
    <div className="container mx-auto px-4 mt-6">
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
        {/* Background glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>

        <div className="relative z-10 flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`relative flex-1 py-3 px-4 font-medium text-center transition-all duration-300 group/tab ${
                activeSubTab === tab
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-amber-100/50'
              }`}
            >
              <span className="relative z-10">{tab}</span>
              {activeSubTab === tab && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
              )}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-300 ${
                  activeSubTab === tab ? 'w-full' : 'group-hover/tab:w-full'
                }`}
              ></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
