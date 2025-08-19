import { useState, useEffect } from 'react';
import { LuTrendingUp } from 'react-icons/lu';
import { Stat, StatsSectionProps } from '../../../../domain/types/dashboard/faculty';

export default function StatsSection({ stats }: StatsSectionProps) {
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
      {stats.map((stat: Stat, index: number) => (
        <div
          key={index}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium mb-1">{stat.title}</h3>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                {animatedStats[index]}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl flex items-center justify-center">
              {stat.icon}
            </div>
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
