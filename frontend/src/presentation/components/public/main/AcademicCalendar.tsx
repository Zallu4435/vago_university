import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const AcademicCalendar: React.FC = () => {
  const [activeTerm, setActiveTerm] = useState(1);

  const terms = [
    { id: 1, name: 'Semester 1', period: 'Aug - Dec', color: 'from-cyan-600 to-blue-600' },
    { id: 2, name: 'Semester 2', period: 'Jan - May', color: 'from-cyan-700 to-blue-700' },
    { id: 3, name: 'Special Term', period: 'May - Aug', color: 'from-cyan-800 to-blue-800' }
  ];

  return (
    <section className="w-full bg-gradient-to-b from-cyan-50 via-white to-cyan-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-800 mb-2 sm:mb-4 flex items-center justify-center">
            <FaCalendarAlt className="mr-2 sm:mr-3 text-cyan-600 text-lg sm:text-xl" />
            Academic Calendar
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-2xl mx-auto px-2">
            Our academic year consists of two regular semesters and a special term, 
            designed to give you flexibility in planning your studies.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {terms.map((term) => (
            <button
              key={term.id}
              onClick={() => setActiveTerm(term.id)}
              className={`
                bg-gradient-to-r ${term.color} text-white p-4 sm:p-6 rounded-lg sm:rounded-xl
                transition-all duration-300 transform hover:-translate-y-1
                ${activeTerm === term.id ? 'ring-2 ring-cyan-200 shadow-lg' : ''}
              `}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{term.name}</h3>
              <p className="text-cyan-100 text-sm sm:text-base">{term.period}</p>
            </button>
          ))}
        </div>

        {/* Term Details */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-cyan-100 mb-6 sm:mb-8">
          <h4 className="text-base sm:text-lg font-semibold text-cyan-800 mb-3 sm:mb-4">
            {terms[activeTerm - 1].name} Important Dates
          </h4>
          <ul className="space-y-1 sm:space-y-2 text-cyan-600 text-sm sm:text-base">
            <li>• Registration Period: First 2 weeks</li>
            <li>• Add/Drop Period: Week 1-2</li>
            <li>• Mid-Term Break: Week 7</li>
            <li>• Final Examinations: Last 2 weeks</li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            to="/academic-calendar"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-semibold group text-sm sm:text-base"
          >
            View Full Calendar
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AcademicCalendar;