import PropTypes from 'prop-types';

export default function CampusLifeTabs({ activeTab, setActiveTab }) {
  const tabs = ['Events', 'Clubs', 'Athletics'];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-lg mb-4 shadow-md border border-amber-200">
      <div className="flex border-b border-amber-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 font-medium ${
              activeTab === tab
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'text-gray-600 hover:bg-amber-100 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

CampusLifeTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};