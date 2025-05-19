import React, { useState } from 'react';
import { FiUser, FiFileText, FiChevronRight, FiXCircle, FiCalendar, FiBook, FiGlobe } from 'react-icons/fi';
import ApprovalModal from './ApprovalModal';
import WarningModal from '../WarningModal';

interface ApplicantDetailsProps {
  selectedApplicant: any;
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
  approveAdmission: (data: any) => void;
  deleteAdmission: (id: string) => void;
  expandedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
  formatDate: (dateString: string) => string;
}

const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({
  selectedApplicant,
  showDetails,
  setShowDetails,
  approveAdmission,
  deleteAdmission,
  expandedSections,
  toggleSection,
  formatDate,
}) => {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  if (!selectedApplicant || !showDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl my-8 mx-4 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h3 className="text-xl font-bold text-blue-800">Applicant Details</h3>
          <button
            onClick={() => setShowDetails(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FiXCircle size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FiUser size={32} className="text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">{selectedApplicant.admission?.personal.fullName}</h4>
            <p className="text-gray-500">{selectedApplicant.admission?.personal.emailAddress}</p>
            <div className="mt-2 flex justify-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedApplicant.admission?.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedApplicant.admission?.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {(selectedApplicant.admission?.status || 'pending').charAt(0).toUpperCase() +
                  (selectedApplicant.admission?.status || 'pending').slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Application ID: {selectedApplicant.admission?.applicationId}</p>
          </div>

          {/* Personal Information */}
          <SectionCard
            title="Personal Information"
            isOpen={expandedSections.personal}
            toggle={() => toggleSection('personal')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Salutation" value={selectedApplicant.admission?.personal.salutation} />
              <InfoRow label="Full Name" value={selectedApplicant.admission?.personal.fullName} />
              <InfoRow label="Family Name" value={selectedApplicant.admission?.personal.familyName} />
              <InfoRow label="Given Name" value={selectedApplicant.admission?.personal.givenName} />
              <InfoRow label="Gender" value={selectedApplicant.admission?.personal.gender} />
              <InfoRow label="Date of Birth" value={selectedApplicant.admission?.personal.dateOfBirth} />
              <InfoRow label="Postal Code" value={selectedApplicant.admission?.personal.postalCode} />
              <InfoRow label="Block Number" value={selectedApplicant.admission?.personal.blockNumber} />
              <InfoRow label="Street Name" value={selectedApplicant.admission?.personal.streetName} />
              <InfoRow label="Building Name" value={selectedApplicant.admission?.personal.buildingName} />
              <InfoRow label="Floor Number" value={selectedApplicant.admission?.personal.floorNumber} />
              <InfoRow label="Unit Number" value={selectedApplicant.admission?.personal.unitNumber} />
              <InfoRow label="State/City" value={selectedApplicant.admission?.personal.stateCity} />
              <InfoRow label="Country" value={selectedApplicant.admission?.personal.country} />
              <InfoRow label="Citizenship" value={selectedApplicant.admission?.personal.citizenship} />
              <InfoRow label="Residential Status" value={selectedApplicant.admission?.personal.residentialStatus} />
              <InfoRow label="Race" value={selectedApplicant.admission?.personal.race} />
              <InfoRow label="Religion" value={selectedApplicant.admission?.personal.religion} />
              <InfoRow label="Marital Status" value={selectedApplicant.admission?.personal.maritalStatus} />
              <InfoRow label="Passport Number" value={selectedApplicant.admission?.personal.passportNumber} />
              <InfoRow label="Email Address" value={selectedApplicant.admission?.personal.emailAddress} />
              <InfoRow label="Alternative Email" value={selectedApplicant.admission?.personal.alternativeEmail} />
              <InfoRow
                label="Mobile Number"
                value={`${selectedApplicant.admission?.personal.mobileCountry || ''} ${
                  selectedApplicant.admission?.personal.mobileArea || ''
                } ${selectedApplicant.admission?.personal.mobileNumber || ''}`.trim()}
              />
              <InfoRow
                label="Phone Number"
                value={`${selectedApplicant.admission?.personal.phoneCountry || ''} ${
                  selectedApplicant.admission?.personal.phoneArea || ''
                } ${selectedApplicant.admission?.personal.phoneNumber || ''}`.trim()}
              />
              <InfoRow label="Alternate Contact Name" value={selectedApplicant.admission?.personal.alternateContactName} />
              <InfoRow label="Relationship" value={selectedApplicant.admission?.personal.relationshipWithApplicant} />
              <InfoRow label="Occupation" value={selectedApplicant.admission?.personal.occupation} />
              <InfoRow
                label="Alternate Mobile"
                value={`${selectedApplicant.admission?.personal.altMobileCountry || ''} ${
                  selectedApplicant.admission?.personal.altMobileArea || ''
                } ${selectedApplicant.admission?.personal.altMobileNumber || ''}`.trim()}
              />
              <InfoRow
                label="Alternate Phone"
                value={`${selectedApplicant.admission?.personal.altPhoneCountry || ''} ${
                  selectedApplicant.admission?.personal.altPhoneArea || ''
                } ${selectedApplicant.admission?.personal.altPhoneNumber || ''}`.trim()}
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
                  <div key={idx} className="p-2 bg-gray-50 rounded">
                    <InfoRow label="Programme" value={choice.programme} />
                    <InfoRow label="Preferred Major" value={choice.preferredMajor || 'N/A'} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No programs selected</p>
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
                <h6 className="text-sm font-medium text-gray-700">Transfer Details</h6>
                <div className="p-2 bg-gray-50 rounded">
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
                <h6 className="text-sm font-medium text-gray-700 mb-1">Responses</h6>
                {Object.entries(selectedApplicant.admission.achievements.questions).map(([key, value]) => (
                  <div key={key} className="p-2 bg-gray-50 rounded mb-2">
                    <p className="text-sm font-medium text-gray-700">Question {key}</p>
                    <p className="text-sm text-gray-600">{value || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
            {selectedApplicant.admission?.achievements?.achievements?.length ? (
              <div className="mt-2">
                <h6 className="text-sm font-medium text-gray-700 mb-1">Achievements</h6>
                {selectedApplicant.admission.achievements.achievements.map((ach, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded mb-2">
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
              <p className="text-sm text-gray-500">No achievements listed</p>
            )}
          </SectionCard>

          {/* Other Information */}
          <SectionCard
            title="Other Information"
            isOpen={expandedSections.otherInfo}
            toggle={() => toggleSection('otherInfo')}
          >
            <h6 className="text-sm font-medium text-gray-700 mb-2">Health</h6>
            <InfoRow label="Health Support" value={selectedApplicant.admission?.otherInformation?.health?.hasHealthSupport || 'N/A'} />
            <InfoRow label="Medical Conditions" value={selectedApplicant.admission?.otherInformation?.health?.medicalConditions || 'N/A'} />
            <InfoRow label="Disabilities" value={selectedApplicant.admission?.otherInformation?.health?.disabilities || 'N/A'} />
            <InfoRow label="Special Needs" value={selectedApplicant.admission?.otherInformation?.health?.specialNeeds || 'N/A'} />
            <h6 className="text-sm font-medium text-gray-700 mt-4 mb-2">Legal</h6>
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
                  <div key={idx} className="flex items-center p-2 bg-gray-50 rounded">
                    <FiFileText size={16} className="text-blue-600 mr-2" />
                    <span className="text-sm">{doc.name}</span>
                    <button className="ml-auto text-blue-600 text-sm hover:underline">View</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded</p>
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
              icon={<FiCalendar size={16} />}
              label="Applied On"
              value={formatDate(selectedApplicant.admission?.createdAt)}
            />
            <InfoRow
              icon={<FiBook size={16} />}
              label="Program"
              value={selectedApplicant.admission?.choiceOfStudy?.[0]?.programme || 'N/A'}
            />
            <InfoRow
              icon={<FiGlobe size={16} />}
              label="Nationality"
              value={selectedApplicant.admission?.personal?.citizenship || 'N/A'}
            />
          </SectionCard>

          {/* Actions */}
          {(selectedApplicant.admission?.status || 'pending') === 'pending' && (
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setShowApprovalModal(true)}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Approve
              </button>
              <button
                onClick={() => setShowWarningModal(true)}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
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

        {showWarningModal && (
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
    </div>
  );
};

// Helper components
const SectionCard = ({ title, children, isOpen, toggle }) => (
  <div className="border rounded-lg bg-white shadow-sm">
    <button
      className="w-full p-4 flex justify-between items-center text-left font-semibold text-blue-800 hover:bg-blue-50"
      onClick={toggle}
    >
      {title}
      <FiChevronRight
        size={16}
        className={`text-blue-600 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
      />
    </button>
    {isOpen && <div className="p-4">{children}</div>}
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center mb-2">
    {icon && <div className="text-blue-600 mr-2">{icon}</div>}
    <span className="text-sm font-medium text-gray-700 mr-2">{label}:</span>
    <span className="text-sm text-gray-600">{value || 'N/A'}</span>
  </div>
);

export default ApplicantDetails;