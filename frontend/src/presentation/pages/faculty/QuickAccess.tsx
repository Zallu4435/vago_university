import PropTypes from 'prop-types';

export default function QuickAccess({ items }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.color} rounded-xl p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
          >
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-white/80 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

QuickAccess.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};