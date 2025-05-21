import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LuTrendingUp } from 'react-icons/lu';

export default function StatsSection({ stats }) {
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0]);

  useEffect(() => {
    const finalStats = stats.map((stat) => stat.value);
    let counts = [0, 0, 0];

    const interval = setInterval(() => {
      let completed = true;
      counts = counts.map((count, i) => {
        if (count < finalStats[i]) {
          completed = false;
          return count + Math.ceil(finalStats[i] / 20);
        }
        return finalStats[i];
      });

      setAnimatedStats(counts);

      if (completed) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [stats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 border-b-4 border-indigo-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium mb-1">{stat.title}</h3>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                {animatedStats[index]}
              </p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">{stat.icon}</div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-500 font-medium">
            <LuTrendingUp size={14} className="mr-1" />
            <span>+{4 + index}% from last week</span>
          </div>
        </div>
      ))}
    </div>
  );
}

StatsSection.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ).isRequired,
};