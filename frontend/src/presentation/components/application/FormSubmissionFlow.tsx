import React, { useState } from 'react';
import { Payment } from './Payment/Payment';
import { Button } from '../base/Button';
import {
  FaExclamationCircle,
  FaFileAlt,
  FaUserCircle,
  FaGraduationCap,
  FaClipboardList,
  FaHeartbeat,
  FaBalanceScale,
  FaAward,
  FaCheckCircle,
  FaEye,
} from 'react-icons/fa';
import DocumentViewModal from './Documents/DocumentViewModal';
import type { DocumentUpload, FormSubmissionFlowProps } from '../../../domain/types/application';

export const FormSubmissionFlow: React.FC<FormSubmissionFlowProps> = ({
  formData,
  onBackToForm,
  onLogout
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionStatus] = useState<{ success: boolean; message: string }>({ success: false, message: '' });
  const [selectedDocument, setSelectedDocument] = useState<DocumentUpload | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.length > 0 ? `${value.length} item(s)` : 'None';
      }
      return Object.entries(value)
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => `${k}: ${formatValue(v)}`)
        .join(', ');
    }
    return String(value);
  };

  const handleRedirectToHome = () => {
    localStorage.removeItem('applicationId');
    if (onLogout) onLogout(); // Log out the user
    window.location.href = '/'; // Redirect to home
  };

  const handleViewDocument = (document: DocumentUpload) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  };

  const closeDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
  };

  const renderKeyValueSection = (
    title: string,
    data: Record<string, any>,
    icon: React.ReactNode,
    excludeKeys: string[] = []
  ) => {
    if (!data) return null;

    const filteredEntries = Object.entries(data)
      .filter(([key]) => !excludeKeys.includes(key) && data[key] !== null && data[key] !== undefined)
      .filter(([, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
        return true;
      });

    if (filteredEntries.length === 0) return null;

    return (
      <div className="mb-6 bg-white rounded-xl border border-cyan-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100 flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold text-cyan-900">{title}</h3>
        </div>
        <div className="p-6">
          {filteredEntries.map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="mb-4">
                  <strong className="text-cyan-800 block mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {value.map((item, idx) => (
                      <li key={idx}>{formatValue(item)}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div
                key={key}
                className="flex justify-between py-3 text-sm border-b border-cyan-50 last:border-0"
              >
                <strong className="text-cyan-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}</strong>
                <span className="text-gray-900 font-medium max-w-[60%] text-right">
                  {formatValue(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {showConfirmation ? (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-cyan-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-6 text-center">
                <FaCheckCircle className="text-6xl mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Application Submitted!</h1>
                <p className="text-green-100 text-lg">
                  Your application has been successfully submitted. We will review your application and inform you of the next steps.
                </p>
                <p className="text-gray-600 text-base mb-8">
                  Application ID: <span className="font-semibold text-cyan-700">{formData.applicationId}</span>
                </p>
                <div className="flex justify-center space-x-6">
                  <Button
                    label="Return to Home"
                    onClick={handleRedirectToHome}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !showPayment ? (
        <div className="max-w-6xl mx-auto">
          {submissionStatus.success === true && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg flex items-start gap-3">
              <FaExclamationCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-green-800">{submissionStatus.message}</p>
              </div>
            </div>
          )}
          {submissionStatus.success === false && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-start gap-3">
              <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-red-800">{submissionStatus.message}</p>
              </div>
            </div>
          )}

          <div className="bg-white shadow-lg rounded-xl border border-cyan-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-6">
              <h2 className="text-2xl font-semibold">Application Summary</h2>
              <p className="text-cyan-100 text-lg mt-2">Please review your information before proceeding</p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 flex items-start gap-3">
              <FaExclamationCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-amber-800 font-medium">
                  Please carefully review your application details before final submission.
                  Once submitted, changes cannot be made.
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-6 max-h-[70vh] overflow-auto pr-2">
                {renderKeyValueSection(
                  'Personal Information',
                  formData.personalInfo,
                  <FaUserCircle className="text-cyan-600" size={20} />,
                  ['applicationId']
                )}

                {formData.choiceOfStudy && formData.choiceOfStudy.length > 0 && (
                  <div className="mb-6 bg-white rounded-xl border border-cyan-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100 flex items-center gap-3">
                      <FaGraduationCap className="text-cyan-600" size={20} />
                      <h3 className="text-lg font-semibold text-cyan-900">Choices of Study</h3>
                    </div>
                    <div className="p-6">
                      {formData.choiceOfStudy.map((choice: any, index: number) => (
                        <div
                          key={index}
                          className="mb-4 pb-4 border-b border-cyan-50 last:border-0"
                        >
                          <div className="flex justify-between mb-2">
                            <strong className="text-cyan-800">Programme {index + 1}:</strong>
                            <span className="text-gray-900 font-medium">{choice.programme}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">Preferred Major:</strong>
                            <span className="text-gray-900 font-medium">{choice.preferredMajor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.education && (
                  <div className="mb-6 bg-white rounded-xl border border-cyan-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100 flex items-center gap-3">
                      <FaClipboardList className="text-cyan-600" size={20} />
                      <h3 className="text-lg font-semibold text-cyan-900">
                        {formData.education.studentType === 'local' && 'Local Student Education'}
                        {formData.education.studentType === 'transfer' && 'Transfer Student Education'}
                        {formData.education.studentType === 'international' && 'International Student Education'}
                      </h3>
                    </div>
                    <div className="p-6">
                      {formData.education.studentType === 'local' && formData.education.local && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">School Name:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.local.schoolName}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">Country:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.local.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">Duration:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.local.from} - {formData.education.local.to}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">National ID:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.local.nationalID}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">School Category:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.local.localSchoolCategory}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">State/Province:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.local.stateOrProvince}</span>
                          </div>
                        </div>
                      )}

                      {formData.education.studentType === 'transfer' && formData.education.transfer && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">School Name:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.transfer.schoolName}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">Country:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.transfer.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">Duration:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.transfer.from} - {formData.education.transfer.to}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">Previous University:</strong>
                            <span className="text-gray-900 font-medium">
                              {formData.education.transfer.previousUniversity === 'other'
                                ? formData.education.transfer.otherUniversity
                                : formData.education.transfer.previousUniversity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">Credits Earned:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.transfer.creditsEarned}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">GPA:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.transfer.gpa}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">Program Studied:</strong>
                            <span className="text-gray-900 font-medium">{formData.education.transfer.programStudied}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-cyan-800">Reason for Transfer:</strong>
                            <span className="text-gray-900 font-medium max-w-[60%] text-right">{formData.education.transfer.reasonForTransfer}</span>
                          </div>
                        </div>
                      )}

                      {formData.education.studentType === 'international' && formData.education.international && (
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <strong className="text-cyan-800">School Name:</strong>
                              <span className="text-gray-900 font-medium">{formData.education.international.schoolName}</span>
                            </div>
                            <div className="flex justify-between">
                              <strong className="text-cyan-800">Country:</strong>
                              <span className="text-gray-900 font-medium">{formData.education.international.country}</span>
                            </div>
                            <div className="flex justify-between">
                              <strong className="text-cyan-800">Duration:</strong>
                              <span className="text-gray-900 font-medium">{formData.education.international.from} - {formData.education.international.to}</span>
                            </div>
                            <div className="flex justify-between">
                              <strong className="text-cyan-800">Examination:</strong>
                              <span className="text-gray-900 font-medium">{formData.education.international.examination}</span>
                            </div>
                            <div className="flex justify-between">
                              <strong className="text-cyan-800">Exam Month/Year:</strong>
                              <span className="text-gray-900 font-medium">{formData.education.international.examMonthYear}</span>
                            </div>
                            <div className="flex justify-between">
                              <strong className="text-cyan-800">Result Type:</strong>
                              <span className="text-gray-900 font-medium capitalize">{formData.education.international.resultType}</span>
                            </div>
                          </div>

                          {formData.education.international.subjects && formData.education.international.subjects.length > 0 && (
                            <div>
                              <strong className="text-cyan-800 block mb-2">Subjects:</strong>
                              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {formData.education.international.subjects.map((subject: any, index: number) => (
                                  <li key={index}>
                                    {subject.subject === 'other' ? subject.otherSubject : subject.subject}: {subject.marksObtained}/{subject.maxMarks}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* English Proficiency Tests */}
                          {formData.education.international.ielts && Object.values(formData.education.international.ielts).some(val => val) && (
                            <div>
                              <strong className="text-cyan-800 block mb-2">IELTS:</strong>
                              <div className="text-sm text-gray-700">
                                {formData.education.international.ielts.date && <div>Date: {formData.education.international.ielts.date}</div>}
                                {formData.education.international.ielts.overall && <div>Overall: {formData.education.international.ielts.overall}</div>}
                                {formData.education.international.ielts.reading && <div>Reading: {formData.education.international.ielts.reading}</div>}
                                {formData.education.international.ielts.writing && <div>Writing: {formData.education.international.ielts.writing}</div>}
                              </div>
                            </div>
                          )}

                          {formData.education.international.toefl && Object.values(formData.education.international.toefl).some(val => val) && (
                            <div>
                              <strong className="text-cyan-800 block mb-2">TOEFL:</strong>
                              <div className="text-sm text-gray-700">
                                {formData.education.international.toefl.date && <div>Date: {formData.education.international.toefl.date}</div>}
                                {formData.education.international.toefl.grade && <div>Score: {formData.education.international.toefl.grade}</div>}
                                {formData.education.international.toefl.type && <div>Type: {formData.education.international.toefl.type}</div>}
                              </div>
                            </div>
                          )}

                          {formData.education.international.sat && Object.values(formData.education.international.sat).some(val => val) && (
                            <div>
                              <strong className="text-cyan-800 block mb-2">SAT:</strong>
                              <div className="text-sm text-gray-700">
                                {formData.education.international.sat.date && <div>Date: {formData.education.international.sat.date}</div>}
                                {formData.education.international.sat.math && <div>Math: {formData.education.international.sat.math}</div>}
                                {formData.education.international.sat.reading && <div>Reading: {formData.education.international.sat.reading}</div>}
                                {formData.education.international.sat.essay && <div>Essay: {formData.education.international.sat.essay}</div>}
                              </div>
                            </div>
                          )}

                          {formData.education.international.act && Object.values(formData.education.international.act).some(val => val) && (
                            <div>
                              <strong className="text-cyan-800 block mb-2">ACT:</strong>
                              <div className="text-sm text-gray-700">
                                {formData.education.international.act.date && <div>Date: {formData.education.international.act.date}</div>}
                                {formData.education.international.act.composite && <div>Composite: {formData.education.international.act.composite}</div>}
                                {formData.education.international.act.english && <div>English: {formData.education.international.act.english}</div>}
                                {formData.education.international.act.math && <div>Math: {formData.education.international.act.math}</div>}
                                {formData.education.international.act.reading && <div>Reading: {formData.education.international.act.reading}</div>}
                                {formData.education.international.act.science && <div>Science: {formData.education.international.act.science}</div>}
                              </div>
                            </div>
                          )}

                          {formData.education.international.ap && formData.education.international.ap.subjects && formData.education.international.ap.subjects.length > 0 && (
                            <div>
                              <strong className="text-cyan-800 block mb-2">AP Subjects:</strong>
                              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {formData.education.international.ap.subjects.map((subject: any, index: number) => (
                                  <li key={index}>
                                    {subject.subject}: {subject.score}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formData.achievements && (
                  <div className="mb-6 bg-white rounded-xl border border-cyan-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100 flex items-center gap-3">
                      <FaAward className="text-cyan-600" size={20} />
                      <h3 className="text-lg font-semibold text-cyan-900">Achievements</h3>
                    </div>
                    <div className="p-6">
                      {formData.achievements.questions && (
                        <div className="mb-4">
                          <strong className="text-cyan-800 block mb-2">Questions:</strong>
                          {Object.entries(formData.achievements.questions).map(([key, value]) => (
                            <div key={key} className="mb-2">
                              <span className="text-gray-700">Q{key}: </span>
                              <span className="text-gray-900">{formatValue(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {formData.achievements.achievements && formData.achievements.achievements.length > 0 && (
                        <div>
                          <strong className="text-cyan-800 block mb-2">Achievements:</strong>
                          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                            {formData.achievements.achievements.map((achievement: any, index: number) => (
                              <li key={index}>
                                {achievement.activity} - {achievement.level} ({achievement.levelOfAchievement})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formData.otherInformation && (
                  <>
                    {formData.otherInformation.health && (
                      renderKeyValueSection(
                        'Health Information',
                        formData.otherInformation.health,
                        <FaHeartbeat className="text-cyan-600" size={20} />
                      )
                    )}
                    {formData.otherInformation.legal && (
                      renderKeyValueSection(
                        'Legal Information',
                        formData.otherInformation.legal,
                        <FaBalanceScale className="text-cyan-600" size={20} />
                      )
                    )}
                  </>
                )}

                {formData.documents && formData.documents.documents && (
                  <div className="mb-6 bg-white rounded-xl border border-cyan-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100 flex items-center gap-3">
                      <FaFileAlt className="text-cyan-600" size={20} />
                      <h3 className="text-lg font-semibold text-cyan-900">Uploaded Documents</h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {formData.documents.documents.map((doc: any, index: number) => (
                          <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1">
                              <strong className="text-cyan-800">{doc.name}:</strong>
                              <span className="ml-2 text-gray-700">
                                {doc.fileName ? doc.fileName : <span className="text-red-500 italic">Not uploaded</span>}
                              </span>
                            </div>
                            {doc.fileName && (
                              <button
                                onClick={() => handleViewDocument(doc)}
                                className="ml-4 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-md hover:bg-cyan-200 transition-colors duration-200 flex items-center gap-2 text-sm"
                              >
                                <FaEye size={14} />
                                View
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {renderKeyValueSection(
                  'Declaration',
                  formData.declaration || {},
                  <FaClipboardList className="text-cyan-600" size={20} />
                )}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-cyan-100">
                <Button
                  label="Back to Edit"
                  onClick={onBackToForm}
                  className="flex items-center gap-2 text-cyan-700 bg-white border border-cyan-300 hover:bg-cyan-50 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                />
                <Button
                  label="Proceed to Payment"
                  onClick={() => setShowPayment(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <FaFileAlt size={16} />
              Your information is secure and will only be used for application purposes
            </p>
          </div>
        </div>
      ) : (
        <Payment
          formData={formData}
          onComplete={() => setShowConfirmation(true)}
          onPrevious={() => setShowPayment(false)}
        />
      )}

      {/* Document View Modal */}
      <DocumentViewModal
        isOpen={showDocumentModal}
        document={selectedDocument}
        onClose={closeDocumentModal}
      />
    </>
  );
};