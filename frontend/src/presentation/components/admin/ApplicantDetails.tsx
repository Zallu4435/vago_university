import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiFileText,
  FiChevronRight,
  FiX,
  FiCalendar,
  FiBook,
  FiGlobe,
  FiCheckCircle,
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiUsers,
  FiShield,
  FiBuilding,
  FiEye,
  FiDownload,
  FiInfo,
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
  onViewDocument?: (document: { name: string; url: string }) => void;
  onDownloadDocument?: (document: { name: string; url: string }) => void;
}

const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({
  selectedApplicant,
  showDetails,
  setShowDetails,
  approveAdmission,
  rejectAdmission,
  deleteAdmission,
  onViewDocument,
  onDownloadDocument,
}) => {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    programs: false,
    education: false,
    achievements: false,
    otherInfo: false,
    documents: false,
    declaration: false,
    application: false,
  });


  // Prevent backend scrolling when modal is open
  useEffect(() => {
    if (showDetails) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showDetails]);

  if (!selectedApplicant || !showDetails) return null;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewDocument = (document: any) => {
    if (!document) {
      return;
    }
    if (!document.url) {
      return;
    }
    if (onViewDocument) {
      onViewDocument(document);
    } else {
      try {
        window.open(document.url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error opening document:', error);
      }
    }
  };

  const handleDownloadDocument = (document: any) => {
    if (!document) {
      console.error('No document provided');
      return;
    }
    if (!document.url) {
      console.error('Document URL is missing:', document);
      return;
    }
    if (onDownloadDocument) {
      console.log('Using custom download handler');
      onDownloadDocument(document);
    } else {
      console.log('Using default download handler, downloading URL:', document.url);
      try {
        const link = document.createElement('a');
        link.href = document.url;
        link.download = document.name || 'document';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        console.log('Created download link:', {
          href: link.href,
          download: link.download,
        });
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading document:', error);
      }
    }
  };

  // Particle effect
  const ghostParticles = Array(30)
    .fill(0)
    .map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animDuration: Math.random() * 10 + 15,
      animDelay: Math.random() * 5,
    }));

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background particles */}
      {ghostParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatParticle ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}

      {/* Main Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border border-purple-500/30">
                <FiUser size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">
                  {selectedApplicant.admission?.personal?.fullName || 'N/A'}
                </h2>
                <p className="text-purple-200 flex items-center mt-1">
                  <FiMail size={16} className="mr-2" />
                  {selectedApplicant.admission?.personal?.emailAddress || 'N/A'}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <StatusBadge status={selectedApplicant.admission?.status || 'pending'} />
                  <span className="text-sm text-purple-300">
                    ID: {selectedApplicant.admission?.applicationId || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <FiX size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <QuickInfoCard
              icon={<FiCalendar className="text-purple-300" />}
              title="Applied On"
              value={formatDate(selectedApplicant.admission?.createdAt)}
            />
            <QuickInfoCard
              icon={<FiBook className="text-purple-300" />}
              title="Program"
              value={selectedApplicant.admission?.choiceOfStudy?.[0]?.programme || 'N/A'}
            />
            <QuickInfoCard
              icon={<FiGlobe className="text-purple-300" />}
              title="Nationality"
              value={selectedApplicant.admission?.personal?.citizenship || 'N/A'}
            />
          </div>

          {/* Personal Information */}
          <SectionCard
            title="Personal Information"
            icon={<FiUser className="text-purple-300" />}
            isOpen={expandedSections.personal}
            toggle={() => toggleSection('personal')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <InfoGroup title="Basic Information">
                <InfoRow label="Salutation" value={selectedApplicant.admission?.personal?.salutation} />
                <InfoRow label="Full Name" value={selectedApplicant.admission?.personal?.fullName} />
                <InfoRow label="Family Name" value={selectedApplicant.admission?.personal?.familyName} />
                <InfoRow label="Given Name" value={selectedApplicant.admission?.personal?.givenName} />
                <InfoRow label="Gender" value={selectedApplicant.admission?.personal?.gender} />
                <InfoRow label="Date of Birth" value={selectedApplicant.admission?.personal?.dateOfBirth} />
                <InfoRow label="Marital Status" value={selectedApplicant.admission?.personal?.maritalStatus} />
              </InfoGroup>

              <InfoGroup title="Contact Information">
                <InfoRow
                  label="Mobile"
                  value={`${selectedApplicant.admission?.personal?.mobileCountry || ''} ${
                    selectedApplicant.admission?.personal?.mobileArea || ''
                  } ${selectedApplicant.admission?.personal?.mobileNumber || ''}`.trim()}
                />
                <InfoRow
                  label="Phone"
                  value={`${selectedApplicant.admission?.personal?.phoneCountry || ''} ${
                    selectedApplicant.admission?.personal?.phoneArea || ''
                  } ${selectedApplicant.admission?.personal?.phoneNumber || ''}`.trim()}
                />
                <InfoRow label="Alt Email" value={selectedApplicant.admission?.personal?.alternativeEmail} />
                <InfoRow
                  label="Alternate Contact Name"
                  value={selectedApplicant.admission?.personal?.alternateContactName}
                />
                <InfoRow
                  label="Relationship"
                  value={selectedApplicant.admission?.personal?.relationshipWithApplicant}
                />
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
              </InfoGroup>

              <InfoGroup title="Address">
                <InfoRow
                  label="Street"
                  value={`${selectedApplicant.admission?.personal?.blockNumber || ''} ${
                    selectedApplicant.admission?.personal?.streetName || ''
                  }`.trim()}
                />
                <InfoRow label="Building" value={selectedApplicant.admission?.personal?.buildingName} />
                <InfoRow
                  label="Unit"
                  value={`Floor ${selectedApplicant.admission?.personal?.floorNumber || 'N/A'}, Unit ${
                    selectedApplicant.admission?.personal?.unitNumber || 'N/A'
                  }`}
                />
                <InfoRow label="City/State" value={selectedApplicant.admission?.personal?.stateCity} />
                <InfoRow label="Country" value={selectedApplicant.admission?.personal?.country} />
                <InfoRow label="Postal Code" value={selectedApplicant.admission?.personal?.postalCode} />
                <InfoRow label="Citizenship" value={selectedApplicant.admission?.personal?.citizenship} />
                <InfoRow
                  label="Residential Status"
                  value={selectedApplicant.admission?.personal?.residentialStatus}
                />
                <InfoRow label="Race" value={selectedApplicant.admission?.personal?.race} />
                <InfoRow label="Religion" value={selectedApplicant.admission?.personal?.religion} />
                <InfoRow label="Passport Number" value={selectedApplicant.admission?.personal?.passportNumber} />
              </InfoGroup>
            </div>
          </SectionCard>

          {/* Choice of Study */}
          <SectionCard
            title="Choice of Study"
            icon={<FiBook className="text-purple-300" />}
            isOpen={expandedSections.programs}
            toggle={() => toggleSection('programs')}
          >
            <div className="space-y-4">
              {selectedApplicant.admission?.choiceOfStudy?.length ? (
                selectedApplicant.admission.choiceOfStudy.map((choice: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-800/80 p-4 rounded-lg border border-purple-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-purple-100">{choice.programme}</h4>
                        <p className="text-purple-200 mt-1">Preferred Major: {choice.preferredMajor || 'N/A'}</p>
                      </div>
                      <span className="bg-purple-600/30 text-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                        Choice {idx + 1}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-purple-300">No programs selected</p>
              )}
            </div>
          </SectionCard>

          {/* Education */}
          <SectionCard
            title="Education Background"
            icon={<FiUsers className="text-purple-300" />}
            isOpen={expandedSections.education}
            toggle={() => toggleSection('education')}
          >
            <div className="space-y-4">
              <InfoRow
                label="Student Type"
                value={selectedApplicant.admission?.education?.studentType || 'N/A'}
              />
              {selectedApplicant.admission?.education?.transfer && (
                <div className="bg-gray-800/80 p-4 rounded-lg border border-purple-500/30">
                  <h4 className="font-semibold text-purple-100 mb-3">Previous Education</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow
                      label="School"
                      value={selectedApplicant.admission.education.transfer.schoolName}
                    />
                    <InfoRow
                      label="Duration"
                      value={`${selectedApplicant.admission.education.transfer.from} - ${selectedApplicant.admission.education.transfer.to}`}
                    />
                    <InfoRow label="GPA" value={selectedApplicant.admission.education.transfer.gpa} />
                    <InfoRow
                      label="Program"
                      value={selectedApplicant.admission.education.transfer.programStudied}
                    />
                    <InfoRow
                      label="Country"
                      value={selectedApplicant.admission.education.transfer.country}
                    />
                    <InfoRow
                      label="Previous University"
                      value={selectedApplicant.admission.education.transfer.previousUniversity}
                    />
                    <InfoRow
                      label="Credits Earned"
                      value={selectedApplicant.admission.education.transfer.creditsEarned}
                    />
                    <InfoRow
                      label="Reason for Transfer"
                      value={selectedApplicant.admission.education.transfer.reasonForTransfer}
                    />
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Achievements */}
          <SectionCard
            title="Achievements & Activities"
            icon={<FiAward className="text-purple-300" />}
            isOpen={expandedSections.achievements}
            toggle={() => toggleSection('achievements')}
          >
            <div className="space-y-6">
              <InfoRow
                label="Has Achievements"
                value={selectedApplicant.admission?.achievements?.hasNoAchievements ? 'No' : 'Yes'}
              />
              {selectedApplicant.admission?.achievements?.questions && (
                <div>
                  <h4 className="font-semibold text-purple-100 mb-3">Personal Statements</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedApplicant.admission.achievements.questions).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="bg-gray-800/80 p-4 rounded-lg border border-purple-500/30"
                        >
                          <p className="text-purple-200">{value || 'N/A'}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              {selectedApplicant.admission?.achievements?.achievements?.length ? (
                <div>
                  <h4 className="font-semibold text-purple-100 mb-3">Activities & Leadership</h4>
                  <div className="space-y-4">
                    {selectedApplicant.admission.achievements.achievements.map((ach: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-gray-800/80 p-4 rounded-lg border border-purple-500/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-purple-100">{ach.activity}</h5>
                            <p className="text-purple-200 mt-1">
                              {ach.organizationName} • {ach.positionHeld}
                            </p>
                            <p className="text-purple-300 text-sm mt-1">
                              {ach.fromDate} - {ach.toDate}
                            </p>
                            <p className="text-purple-200 mt-2">{ach.description}</p>
                          </div>
                          <span className="bg-purple-600/30 text-purple-100 px-2 py-1 rounded text-sm">
                            {ach.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-purple-300">No achievements listed</p>
              )}
            </div>
          </SectionCard>

          {/* Documents */}
          <SectionCard
            title="Uploaded Documents"
            icon={<FiFileText className="text-purple-300" />}
            isOpen={expandedSections.documents}
            toggle={() => toggleSection('documents')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedApplicant.admission?.documents?.documents?.length ? (
                selectedApplicant.admission.documents.documents.map((doc: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-800/80 rounded-lg border border-purple-500/30"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-600/30 rounded-lg mr-3">
                        <FiFileText size={18} className="text-purple-300" />
                      </div>
                      <span className="text-purple-100 font-medium">{doc.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="p-1 text-purple-300 hover:bg-purple-500/20 rounded transition-colors"
                        title="View Document"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(doc)}
                        className="p-1 text-purple-300 hover:bg-purple-500/20 rounded transition-colors"
                        title="Download Document"
                      >
                        <FiDownload size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-purple-300">No documents uploaded</p>
              )}
            </div>
          </SectionCard>

          {/* Other Information */}
          <SectionCard
            title="Additional Information"
            icon={<FiInfo className="text-purple-300" />}
            isOpen={expandedSections.otherInfo}
            toggle={() => toggleSection('otherInfo')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoGroup title="Health Information">
                <InfoRow
                  label="Health Support Required"
                  value={selectedApplicant.admission?.otherInformation?.health?.hasHealthSupport}
                />
                <InfoRow
                  label="Medical Conditions"
                  value={selectedApplicant.admission?.otherInformation?.health?.medicalConditions}
                />
                <InfoRow
                  label="Disabilities"
                  value={selectedApplicant.admission?.otherInformation?.health?.disabilities}
                />
                <InfoRow
                  label="Special Needs"
                  value={selectedApplicant.admission?.otherInformation?.health?.specialNeeds}
                />
              </InfoGroup>

              <InfoGroup title="Legal Information">
                <InfoRow
                  label="Criminal Record"
                  value={selectedApplicant.admission?.otherInformation?.legal?.hasCriminalRecord}
                />
                <InfoRow
                  label="Criminal Details"
                  value={selectedApplicant.admission?.otherInformation?.legal?.criminalRecord}
                />
                <InfoRow
                  label="Legal Proceedings"
                  value={selectedApplicant.admission?.otherInformation?.legal?.legalProceedings}
                />
              </InfoGroup>
            </div>
          </SectionCard>

          {/* Declaration */}
          <SectionCard
            title="Declarations & Consent"
            icon={<FiShield className="text-purple-300" />}
            isOpen={expandedSections.declaration}
            toggle={() => toggleSection('declaration')}
          >
            <div className="space-y-3">
              <ConsentRow
                label="Privacy Policy Agreement"
                value={selectedApplicant.admission?.declaration?.privacyPolicy}
              />
              <ConsentRow
                label="Marketing Email Consent"
                value={selectedApplicant.admission?.declaration?.marketingEmail}
              />
              <ConsentRow
                label="Marketing Call Consent"
                value={selectedApplicant.admission?.declaration?.marketingCall}
              />
            </div>
          </SectionCard>

          {/* Application Details */}
          <SectionCard
            title="Application Details"
            icon={<FiInfo className="text-purple-300" />}
            isOpen={expandedSections.application}
            toggle={() => toggleSection('application')}
          >
            <InfoRow
              icon={<FiCalendar className="text-purple-300" />}
              label="Applied On"
              value={formatDate(selectedApplicant.admission?.createdAt)}
            />
            <InfoRow
              icon={<FiBook className="text-purple-300" />}
              label="Program"
              value={selectedApplicant.admission?.choiceOfStudy?.[0]?.programme || 'N/A'}
            />
            <InfoRow
              icon={<FiGlobe className="text-purple-300" />}
              label="Nationality"
              value={selectedApplicant.admission?.personal?.citizenship || 'N/A'}
            />
          </SectionCard>
        </div>

        {/* Actions Footer */}
        {(selectedApplicant.admission?.status || 'pending') === 'pending' && (
          <div className="border-t border-purple-500/30 bg-gray-900/80 p-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setShowApprovalModal(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center border border-blue-500/50"
              >
                <FiCheckCircle size={20} className="mr-2" />
                Approve Application
              </button>
              <button
                onClick={() => {
                  rejectAdmission({
                    id: selectedApplicant.admission._id,
                    reason: 'Application rejected',
                  });
                  setShowDetails(false);
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center border border-red-500/50"
              >
                <FiAlertCircle size={20} className="mr-2" />
                Reject Application
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {showApprovalModal && (
          <ApprovalModal
            isOpen={showApprovalModal}
            onClose={() => setShowApprovalModal(false)}
            onApprove={(data) => {
              approveAdmission({
                admission: selectedApplicant.admission,
                ...data,
              });
              setShowApprovalModal(false);
              setShowDetails(false);
            }}
            onReject={(reason) => {
              rejectAdmission({
                id: selectedApplicant.admission._id,
                reason,
              });
              setShowApprovalModal(false);
              setShowDetails(false);
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
        .no-scroll {
          overflow: hidden;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
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

// Component definitions
const QuickInfoCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) => (
  <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      {icon}
      <span className="ml-2 text-sm font-medium text-purple-300">{title}</span>
    </div>
    <p className="text-white font-semibold">{value || 'N/A'}</p>
  </div>
);

const SectionCard = ({
  title,
  icon,
  isOpen,
  toggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg shadow-sm overflow-hidden">
    <div
      className="p-4 bg-gray-900/60 cursor-pointer hover:bg-purple-900/20 transition-colors flex items-center justify-between"
      onClick={toggle}
    >
      <div className="flex items-center">
        {icon}
        <h3 className="ml-3 text-lg font-semibold text-purple-100">{title}</h3>
      </div>
      <FiChevronRight
        size={20}
        className={`text-purple-300 transition-transform ${isOpen ? 'rotate-90' : ''}`}
      />
    </div>
    {isOpen && <div className="p-6">{children}</div>}
  </div>
);

const InfoGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="font-semibold text-purple-100 mb-3 pb-2 border-b border-purple-500/30">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string | number | boolean | null | undefined }) => (
  <div className="flex justify-between py-1">
    <span className="text-purple-300 text-sm">{label}:</span>
    <span className="text-white text-sm font-medium text-right">
      {value === null || value === undefined || value === '' ? 'N/A' : String(value)}
    </span>
  </div>
);

const ConsentRow = ({ label, value }: { label: string; value: boolean | undefined }) => (
  <div className="flex items-center justify-between p-3 bg-gray-800/80 rounded-lg border border-purple-500/30">
    <span className="text-purple-100">{label}</span>
    <div className="flex items-center">
      {value ? (
        <div className="flex items-center text-blue-400">
          <FiCheckCircle size={16} className="mr-1" />
          <span className="text-sm font-medium">Accepted</span>
        </div>
      ) : (
        <div className="flex items-center text-red-400">
          <FiX size={16} className="mr-1" />
          <span className="text-sm">Not Accepted</span>
        </div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-600/30', text: 'text-yellow-100', border: 'border-yellow-500/50' },
    approved: { bg: 'bg-green-600/30', text: 'text-green-100', border: 'border-green-500/50' },
    rejected: { bg: 'bg-red-600/30', text: 'text-red-100', border: 'border-red-500/50' },
    offered: { bg: 'bg-blue-600/30', text: 'text-blue-100', border: 'border-blue-500/50' },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default ApplicantDetails;