import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

interface EventItem {
  date: string;
  month: string;
  title: string;
  description: string;
  type: string;
  attendees: string;
}

interface DepartmentEventsProps {
  events: EventItem[];
}

const DepartmentEvents: React.FC<DepartmentEventsProps> = ({ events }) => (
  <section
    id="events"
    data-animate
    className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 transition-all duration-1000"
  >
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">
          Upcoming Events
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-cyan-600 max-w-3xl mx-auto px-2">
          Join us for exciting events, workshops, and networking opportunities
        </p>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {events.map((event, index) => (
          <div
            key={index}
            className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 transition-all duration-300 hover:scale-105 relative"
          >
            <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-center text-white">
                <div className="text-sm sm:text-xl font-bold">{event.date}</div>
                <div className="text-xs font-medium">{event.month}</div>
              </div>
            </div>
            <div className="pt-6 sm:pt-8">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-cyan-100 text-cyan-600">
                  {event.type}
                </span>
                <span className="text-xs sm:text-sm text-cyan-600 font-medium">
                  {event.attendees} attendees
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-cyan-800 mb-2 sm:mb-3 group-hover:text-cyan-600 transition-colors">
                {event.title}
              </h3>
              <p className="text-cyan-600 mb-4 sm:mb-6 text-sm sm:text-base">{event.description}</p>
              <button className="inline-flex items-center text-cyan-600 font-medium hover:text-cyan-700 group text-sm sm:text-base">
                View Details
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DepartmentEvents; 