import PropTypes from 'prop-types';

export default function FinancialTabs({ activeTab, setActiveTab }) {
  const tabs = ['Fees and Payments', 'Financial Aid', 'Scholarships'];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
      <div className="relative z-10 flex flex-col sm:flex-row border-b border-amber-200/50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-3 px-4 sm:px-6 font-medium text-center transition-all duration-300 group/tab ${
              activeTab === tab
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-2xl sm:rounded-2xl'
                : 'text-gray-600 hover:text-gray-900 hover:bg-amber-100/50'
            }`}
          >
            <span className="relative z-10">{tab}</span>
            {activeTab === tab && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-t-2xl sm:rounded-2xl"></div>
            )}
            <div
              className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-300 ${
                activeTab === tab ? 'w-full' : 'group-hover/tab:w-full'
              }`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}

FinancialTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
