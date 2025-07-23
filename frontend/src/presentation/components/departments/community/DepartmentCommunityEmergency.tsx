import React from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { VisibilityState } from '../../../../shared/hooks/useSectionAnimation';

interface EmergencyContact {
  title: string;
  phone: string;
  email: string;
}

interface EmergencyContactProps {
  emergencyContact: {
    title: string;
    contacts: EmergencyContact[];
  };
  isVisible: VisibilityState;
}

const DepartmentCommunityEmergency: React.FC<EmergencyContactProps> = ({ emergencyContact, isVisible }) => (
  <section
    id="emergency-contact"
    data-animate
    className={`w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-800 ${
      isVisible['emergency-contact'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-3 sm:mb-4">{emergencyContact.title}</h2>
      <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto" />
    </div>
    <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl border border-cyan-100 p-4 sm:p-6 lg:p-8">
      <div className="space-y-4 sm:space-y-6">
        {emergencyContact.contacts.map((contact, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-cyan-100 pb-3 sm:pb-4 last:border-b-0">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-cyan-800 mb-1 sm:mb-2">{contact.title}</h4>
              <div className="flex items-center space-x-2 text-cyan-600 text-sm sm:text-base">
                <FaPhone />
                <p>{contact.phone}</p>
              </div>
              <div className="flex items-center space-x-2 text-cyan-600 text-sm sm:text-base">
                <FaEnvelope />
                <p>{contact.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DepartmentCommunityEmergency; 