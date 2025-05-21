import React, { useState } from 'react';
import { 
  FiUser, 
  FiFileText, 
  FiChevronRight, 
  FiXCircle, 
  FiCalendar, 
  FiBook, 
  FiGlobe,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import ApprovalModal from './ApprovalModal';
import WarningModal from '../WarningModal';

interface ApplicantDetailsProps {
  selectedApplicant: any;
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
  approveAdmission: (data: any) => void;
  rejectAdmission: (data: { id: string; reason: string }) => void;
  deleteAdmission?: (id: string) => void;
  expandedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
  formatDate: (dateString: string) => string;
}

const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({
  selectedApplicant,
  showDetails,
  setShowDetails,
  approveAdmission,
  expandedSections,
  toggleSection,
  formatDate,
  rejectAdmission,
  deleteAdmission
}) => {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  if (!selectedApplicant || !showDetails) return null;

  // Background ghost particle effect
  const ghostParticles = Array(15).fill(0).map((_, i) => ({
    size: Math.random() * 12 + 4,
    top: Math.random() * 100,
    left: Math.random() * 100,
    animDuration: Math.random() * 15 + 20,
    animDelay: Math.random() * 5
  }));

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      {/* Floating ghost particles */}
      {ghostParticles.map((particle, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-purple-500/10 blur-md z-0"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatingMist ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}

      {/* Main purple glow effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="bg-gray-800/50 backdrop-blur-md w-full max-w-4xl my-8 mx-4 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20 relative z-10">
        <div className="p-6 border-b border-purple-500/20 sticky top-0 bg-gray-800/70 backdrop-blur-md z-20 flex justify-between items-center">
          <h3 className="text-xl font-bold text-purple-300">Applicant Details</h3>
          <button
            onClick={() => setShowDetails(false)}
            className="p-1 rounded-full hover:bg-purple-900/30 transition-all duration-300 text-purple-300 hover:text-white"
          >
            <FiXCircle size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg shadow-purple-500/20 relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full backdrop-blur-sm"></div>
              <FiUser size={36} className="text-white relative z-10" />
              {/* Small particles around avatar */}
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400/60 rounded-full blur-sm"
                  style={{
                    top: `${50 + Math.cos(i * 60 * Math.PI / 180) * 80}%`,
                    left: `${50 + Math.sin(i * 60 * Math.PI / 180) * 80}%`,
                    animation: `float${i % 3 + 1} ${2 + i * 0.3}s infinite ease-in-out`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
            <h4 className="text-xl font-semibold text-white">{selectedApplicant.admission?.personal?.fullName}</h4>
            <p className="text-gray-300">{selectedApplicant.admission?.personal?.emailAddress}</p>
            <div className="mt-2 flex justify-center">
              <StatusBadge status={selectedApplicant.admission?.status || 'pending'} />
            </div>
            <p className="text-sm text-gray-400 mt-2">Application ID: {selectedApplicant.admission?.applicationId}</p>
          </div>

          {/* Personal Information */}
          <SectionCard
            title="Personal Information"
            isOpen={expandedSections.personal}
            toggle={() => toggleSection('personal')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Salutation" value={selectedApplicant.admission?.personal?.salutation} />
              <InfoRow label="Full Name" value={selectedApplicant.admission?.personal?.fullName} />
              <InfoRow label="Family Name" value={selectedApplicant.admission?.personal?.familyName} />
              <InfoRow label="Given Name" value={selectedApplicant.admission?.personal?.givenName} />
              <InfoRow label="Gender" value={selectedApplicant.admission?.personal?.gender} />
              <InfoRow label="Date of Birth" value={selectedApplicant.admission?.personal?.dateOfBirth} />
              <InfoRow label="Postal Code" value={selectedApplicant.admission?.personal?.postalCode} />
              <InfoRow label="Block Number" value={selectedApplicant.admission?.personal?.blockNumber} />
              <InfoRow label="Street Name" value={selectedApplicant.admission?.personal?.streetName} />
              <InfoRow label="Building Name" value={selectedApplicant.admission?.personal?.buildingName} />
              <InfoRow label="Floor Number" value={selectedApplicant.admission?.personal?.floorNumber} />
              <InfoRow label="Unit Number" value={selectedApplicant.admission?.personal?.unitNumber} />
              <InfoRow label="State/City" value={selectedApplicant.admission?.personal?.stateCity} />
              <InfoRow label="Country" value={selectedApplicant.admission?.personal?.country} />
              <InfoRow label="Citizenship" value={selectedApplicant.admission?.personal?.citizenship} />
              <InfoRow label="Residential Status" value={selectedApplicant.admission?.personal?.residentialStatus} />
              <InfoRow label="Race" value={selectedApplicant.admission?.personal?.race} />
              <InfoRow label="Religion" value={selectedApplicant.admission?.personal?.religion} />
              <InfoRow label="Marital Status" value={selectedApplicant.admission?.personal?.maritalStatus} />
              <InfoRow label="Passport Number" value={selectedApplicant.admission?.personal?.passportNumber} />
              <InfoRow label="Email Address" value={selectedApplicant.admission?.personal?.emailAddress} />
              <InfoRow label="Alternative Email" value={selectedApplicant.admission?.personal?.alternativeEmail} />
              <InfoRow
                label="Mobile Number"
                value={`${selectedApplicant.admission?.personal?.mobileCountry || ''} ${
                  selectedApplicant.admission?.personal?.mobileArea || ''
                } ${selectedApplicant.admission?.personal?.mobileNumber || ''}`.trim()}
              />
              <InfoRow
                label="Phone Number"
                value={`${selectedApplicant.admission?.personal?.phoneCountry || ''} ${
                  selectedApplicant.admission?.personal?.phoneArea || ''
                } ${selectedApplicant.admission?.personal?.phoneNumber || ''}`.trim()}
              />
              <InfoRow label="Alternate Contact Name" value={selectedApplicant.admission?.personal?.alternateContactName} />
              <InfoRow label="Relationship" value={selectedApplicant.admission?.personal?.relationshipWithApplicant} />
              <InfoRow label="Occupation" value={selectedApplicant.admission?.personal?.occupation} />
              <InfoRow
                label="Alternate Mobile"
                value={`${selectedApplicant.admission?.personal?.altMobileCountry || ''} ${
                  selectedApplicant.admission?.personal?.altMobileArea || ''
                } ${selectedApplicant.admission?.personal?.altMobileNumber || ''}`.trim()}
              />
              <InfoRow
                label="Alternate Phone"
                value={`${selectedApplicant.admission?.personal?.altPhoneCountry || ''} ${
                  selectedApplicant.admission?.personal?.altPhoneArea || ''
                } ${selectedApplicant.admission?.personal?.altPhoneNumber || ''}`.trim()}
              />
            </div>
          </SectionCard>

          {/* Choice of Study */}
          <SectionCard
            title="Choice of Study"
            isOpen={expandedSections.programs}
            toggle={() => toggleSection('programs')}
          >
            {selectedApplicant.admission?.choiceOfStudy?.length ? (
              <div className="space-y-2">
                {selectedApplicant.admission.choiceOfStudy.map((choice, idx) => (
                  <div key={idx} className="p-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-purple-500/10">
                    <InfoRow label="Programme" value={choice.programme} />
                    <InfoRow label="Preferred Major" value={choice.preferredMajor || 'N/A'} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No programs selected</p>
            )}
          </SectionCard>

          {/* Education */}
          <SectionCard
            title="Education"
            isOpen={expandedSections.education}
            toggle={() => toggleSection('education')}
          >
            <InfoRow label="Student Type" value={selectedApplicant.admission?.education?.studentType || 'N/A'} />
            {selectedApplicant.admission?.education?.transfer && (
              <div className="mt-2 space-y-2">
                <h6 className="text-sm font-medium text-purple-300">Transfer Details</h6>
                <div className="p-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-purple-500/10">
                  <InfoRow label="School Name" value={selectedApplicant.admission.education.transfer.schoolName} />
                  <InfoRow label="Country" value={selectedApplicant.admission.education.transfer.country} />
                  <InfoRow label="From" value={selectedApplicant.admission.education.transfer.from} />
                  <InfoRow label="To" value={selectedApplicant.admission.education.transfer.to} />
                  <InfoRow label="Previous University" value={selectedApplicant.admission.education.transfer.previousUniversity} />
                  <InfoRow label="Credits Earned" value={selectedApplicant.admission.education.transfer.creditsEarned} />
                  <InfoRow label="GPA" value={selectedApplicant.admission.education.transfer.gpa} />
                  <InfoRow label="Program Studied" value={selectedApplicant.admission.education.transfer.programStudied} />
                  <InfoRow label="Reason for Transfer" value={selectedApplicant.admission.education.transfer.reasonForTransfer} />
                </div>
              </div>
            )}
          </SectionCard>

          {/* Achievements */}
          <SectionCard
            title="Achievements"
            isOpen={expandedSections.achievements}
            toggle={() => toggleSection('achievements')}
          >
            <InfoRow label="Has Achievements" value={selectedApplicant.admission?.achievements?.hasNoAchievements ? 'No' : 'Yes'} />
            {selectedApplicant.admission?.achievements?.questions && (
              <div className="mt-2">
                <h6 className="text-sm font-medium text-purple-300 mb-1">Responses</h6>
                {Object.entries(selectedApplicant.admission.achievements.questions).map(([key, value]) => (
                  <div key={key} className="p-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-purple-500/10 mb-2">
                    <p className="text-sm font-medium text-purple-300">Question {key}</p>
                    <p className="text-sm text-gray-300">{value || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
            {selectedApplicant.admission?.achievements?.achievements?.length ? (
              <div className="mt-2">
                <h6 className="text-sm font-medium text-purple-300 mb-1">Achievements</h6>
                {selectedApplicant.admission.achievements.achievements.map((ach, idx) => (
                  <div key={idx} className="p-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-purple-500/10 mb-2">
                    <InfoRow label="Activity" value={ach.activity} />
                    <InfoRow label="Level" value={ach.level} />
                    <InfoRow label="Position Held" value={ach.positionHeld} />
                    <InfoRow label="Organization" value={ach.organizationName} />
                    <InfoRow label="From" value={ach.fromDate} />
                    <InfoRow label="To" value={ach.toDate} />
                    <InfoRow label="Description" value={ach.description} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No achievements listed</p>
            )}
          </SectionCard>

          {/* Other Information */}
          <SectionCard
            title="Other Information"
            isOpen={expandedSections.otherInfo}
            toggle={() => toggleSection('otherInfo')}
          >
            <h6 className="text-sm font-medium text-purple-300 mb-2">Health</h6>
            <InfoRow label="Health Support" value={selectedApplicant.admission?.otherInformation?.health?.hasHealthSupport || 'N/A'} />
            <InfoRow label="Medical Conditions" value={selectedApplicant.admission?.otherInformation?.health?.medicalConditions || 'N/A'} />
            <InfoRow label="Disabilities" value={selectedApplicant.admission?.otherInformation?.health?.disabilities || 'N/A'} />
            <InfoRow label="Special Needs" value={selectedApplicant.admission?.otherInformation?.health?.specialNeeds || 'N/A'} />
            <h6 className="text-sm font-medium text-purple-300 mt-4 mb-2">Legal</h6>
            <InfoRow label="Criminal Record" value={selectedApplicant.admission?.otherInformation?.legal?.hasCriminalRecord || 'N/A'} />
            <InfoRow label="Criminal Details" value={selectedApplicant.admission?.otherInformation?.legal?.criminalRecord || 'N/A'} />
            <InfoRow label="Legal Proceedings" value={selectedApplicant.admission?.otherInformation?.legal?.legalProceedings || 'N/A'} />
          </SectionCard>

          {/* Documents */}
          <SectionCard
            title="Documents"
            isOpen={expandedSections.documents}
            toggle={() => toggleSection('documents')}
          >
            {selectedApplicant.admission?.documents?.documents?.length ? (
              <div className="space-y-2">
                {selectedApplicant.admission.documents.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-purple-500/10">
                    <div className="p-2 bg-purple-900/30 rounded-full mr-2">
                      <FiFileText size={16} className="text-purple-300" />
                    </div>
                    <span className="text-sm text-gray-300">{doc.name}</span>
                    <button className="ml-auto text-purple-300 text-sm hover:text-white transition-colors duration-300">View</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No documents uploaded</p>
            )}
          </SectionCard>

          {/* Declaration */}
          <SectionCard
            title="Declaration"
            isOpen={expandedSections.declaration}
            toggle={() => toggleSection('declaration')}
          >
            <InfoRow label="Privacy Policy" value={selectedApplicant.admission?.declaration?.privacyPolicy ? 'Accepted' : 'Not Accepted'} />
            <InfoRow label="Marketing Email" value={selectedApplicant.admission?.declaration?.marketingEmail ? 'Accepted' : 'Not Accepted'} />
            <InfoRow label="Marketing Call" value={selectedApplicant.admission?.declaration?.marketingCall ? 'Accepted' : 'Not Accepted'} />
          </SectionCard>

          {/* Application Details */}
          <SectionCard
            title="Application Details"
            isOpen={expandedSections.application}
            toggle={() => toggleSection('application')}
          >
            <InfoRow
              icon={<FiCalendar size={16} className="text-purple-300" />}
              label="Applied On"
              value={formatDate(selectedApplicant.admission?.createdAt)}
            />
            <InfoRow
              icon={<FiBook size={16} className="text-purple-300" />}
              label="Program"
              value={selectedApplicant.admission?.choiceOfStudy?.[0]?.programme || 'N/A'}
            />
            <InfoRow
              icon={<FiGlobe size={16} className="text-purple-300" />}
              label="Nationality"
              value={selectedApplicant.admission?.personal?.citizenship || 'N/A'}
            />
          </SectionCard>

          {/* Actions */}
          {(selectedApplicant.admission?.status || 'pending') === 'pending' && (
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setShowApprovalModal(true)}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-lg shadow-green-500/20 border border-green-500/20"
              >
                <FiCheckCircle size={18} className="mr-2" />
                Approve
              </button>
              <button
                onClick={() => {
                  rejectAdmission({
                    id: selectedApplicant.admission._id,
                    reason: 'Application rejected'
                  });
                  setShowDetails(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-lg shadow-red-500/20 border border-red-500/20"
              >
                <FiAlertCircle size={18} className="mr-2" />
                Reject
              </button>
            </div>
          )}
        </div>

        {showApprovalModal && (
          <ApprovalModal
            isOpen={showApprovalModal}
            onClose={() => setShowApprovalModal(false)}
            onApprove={(data) => {
              approveAdmission({
                admission: selectedApplicant.admission,
                ...data
              });
              setShowApprovalModal(false);
              setShowDetails(false);
            }}
            onReject={(reason) => {
              setShowApprovalModal(false);
            }}
            onDelete={() => {
              setShowApprovalModal(false);
              setShowWarningModal(true);
            }}
            applicantName={selectedApplicant.admission?.personal?.fullName}
          />
        )}

        {showWarningModal && deleteAdmission && (
          <WarningModal
            isOpen={showWarningModal}
            onClose={() => setShowWarningModal(false)}
            onConfirm={() => {
              deleteAdmission(selectedApplicant.admission._id);
              setShowWarningModal(false);
              setShowDetails(false);
            }}
            title="Delete Application"
            message={`Are you sure you want to delete ${selectedApplicant.admission?.personal?.fullName}'s application? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            type="danger"
          />
        )}
      </div>

      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(5px); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-8px) translateX(-7px); }
        }
        
        @keyframes floatingMist {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(15px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(128, 90, 213, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

interface SectionCardProps {
  title: string;
  isOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, isOpen, toggle, children }) => {
  return (
    <div className="border border-purple-500/20 rounded-lg overflow-hidden bg-gray-800/30 backdrop-blur-sm">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-purple-900/20 transition-colors duration-300"
        onClick={toggle}
      >
        <h5 className="font-medium text-purple-300">{title}</h5>
        <div
          className={`transform transition-transform duration-300 ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
        >
          <FiChevronRight size={20} className="text-purple-300" />
        </div>
      </div>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number | boolean | null | undefined;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start py-1.5">
      {icon && <div className="mr-2 mt-0.5">{icon}</div>}
      <span className="text-sm text-gray-400 w-1/3">{label}</span>
      <span className="text-sm text-gray-300 flex-1">
        {value === null || value === undefined || value === '' ? 'N/A' : String(value)}
      </span>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-gray-700';
  let textColor = 'text-gray-300';
  let borderColor = 'border-gray-600';

  switch (status.toLowerCase()) {
    case 'approved':
      bgColor = 'bg-green-900/30';
      textColor = 'text-green-300';
      borderColor = 'border-green-600/30';
      break;
    case 'rejected':
      bgColor = 'bg-red-900/30';
      textColor = 'text-red-300';
      borderColor = 'border-red-600/30';
      break;
    case 'pending':
      bgColor = 'bg-yellow-900/30';
      textColor = 'text-yellow-300';
      borderColor = 'border-yellow-600/30';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} border ${borderColor}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default ApplicantDetails;