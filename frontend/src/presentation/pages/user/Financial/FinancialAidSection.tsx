import { useState, useEffect } from 'react';
import { FaHandHoldingUsd, FaTimes } from 'react-icons/fa';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import { FinancialAidApplication } from '../../../../domain/types/financial';

type ApplicationType = 'Grant' | 'Loan' | 'Work Study';

interface Document {
  name: string;
  url: string;
}

interface ApplicationForm {
  studentId: string;
  term: string;
  amount: number;
  type: ApplicationType;
  documents: Document[];
}

export default function FinancialAidSection() {
  const {
    getFinancialAidApplications,
    applyForFinancialAid,
    uploadDocument,
    loading,
    error,
  } = useFinancial();

  const [applications, setApplications] = useState<FinancialAidApplication[]>([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [applicationType, setApplicationType] = useState<ApplicationType | ''>('');
  const [amount, setAmount] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getFinancialAidApplications();
        setApplications(data || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };
    fetchApplications();
  }, [getFinancialAidApplications]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationType || !amount || selectedFiles.length === 0) {
      setFormError('All fields are required.');
      return;
    }
    if (parseFloat(amount) <= 0) {
      setFormError('Amount must be greater than zero.');
      return;
    }
    setFormError(null);

    try {
      const documentUrls = await Promise.all(
        selectedFiles.map((file) => uploadDocument(file, 'financial-aid'))
      );

      if (documentUrls.every((url) => url !== null)) {
        const application: ApplicationForm = {
          studentId: 'current-user-id', // Replace with auth context
          term: 'Spring 2025',
          amount: parseFloat(amount),
          type: applicationType as ApplicationType,
          documents: documentUrls.map((url, index) => ({
            name: selectedFiles[index].name,
            url: url.url,
          })),
        };

        const result = await applyForFinancialAid(application);
        if (result) {
          setApplications([...applications, result]);
          setShowApplicationForm(false);
          setSelectedFiles([]);
          setApplicationType('');
          setAmount('');
        }
      }
    } catch (err) {
      setFormError('Failed to submit application. Please try again.');
      console.error('Error submitting application:', err);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r from-amber-600 to-orange-500 group mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30"></div>
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaHandHoldingUsd size={20} className="text-white relative z-10" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Financial Aid
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            Spring 2025
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-300">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
        <div className="relative z-10 p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {!showApplicationForm ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-6 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <span>Apply for Financial Aid</span>
                  <FaHandHoldingUsd size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formError && (
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Type
                    </label>
                    <select
                      value={applicationType}
                      onChange={(e) => setApplicationType(e.target.value as ApplicationType | '')}
                      className="block w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-amber-100/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm sm:text-base"
                      required
                      disabled={loading}
                    >
                      <option value="">Select Type</option>
                      <option value="Grant">Grant</option>
                      <option value="Loan">Loan</option>
                      <option value="Work Study">Work Study</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Requested ($)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-amber-100/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm sm:text-base"
                      placeholder="0.00"
                      required
                      min="0"
                      step="0.01"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-2">
                      Supporting Documents
                    </label>
                    <input
                      type="file"
                      multiple
                      id="documents"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-200 file:text-orange-800 file:font-medium hover:file:bg-amber-300 transition-all duration-200"
                      required
                      disabled={loading}
                    />
                    {selectedFiles.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">•</span>
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-amber-100/50">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplicationForm(false);
                        setSelectedFiles([]);
                        setApplicationType('');
                        setAmount('');
                        setFormError(null);
                      }}
                      disabled={loading}
                      className="group px-6 py-3 bg-white/70 backdrop-blur-md border border-amber-200/50 hover:bg-amber-100/50 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <span>Cancel</span>
                      <FaTimes size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
                      <FaHandHoldingUsd size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </form>
              )}
              {applications.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-orange-700 mb-4">My Applications</h4>
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application.id || `${application.type}-${application.amount}`}
                        className="relative overflow-hidden rounded-lg bg-amber-50 p-4 border border-amber-200/50 group hover:shadow-lg transition-all duration-300"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
                        <div className="relative z-10">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                              <h5 className="font-medium text-orange-700">{application.type}</h5>
                              <p className="text-sm text-gray-600">Amount: ${application.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Term: {application.term}</p>
                            </div>
                            <span
                              className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                application.status === 'Approved'
                                  ? 'bg-green-100 text-green-800'
                                  : application.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {application.status}
                            </span>
                          </div>
                          {application.documents?.length > 0 && (
                            <div className="mt-3">
                              <h6 className="text-sm font-medium text-orange-700 mb-2">Documents:</h6>
                              <ul className="space-y-1">
                                {application.documents.map((doc, index) => (
                                  <li key={index} className="flex items-center text-sm text-gray-600">
                                    <span className="mr-2">•</span>
                                    <a
                                      href={doc.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-orange-600 hover:text-orange-800 hover:underline"
                                    >
                                      {doc.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}