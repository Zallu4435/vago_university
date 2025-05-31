import { useState, useEffect } from 'react';
import { FaAward } from 'react-icons/fa';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import { Scholarship, ScholarshipApplication } from '../../../../domain/types/financial';

export default function ScholarshipsSection() {
  const {
    getAvailableScholarships,
    getScholarshipApplications,
    applyForScholarship,
    uploadDocument,
    loading,
    error,
  } = useFinancial();

  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showScholarships, setShowScholarships] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scholarshipsData, applicationsData] = await Promise.all([
          getAvailableScholarships(),
          getScholarshipApplications(),
        ]);
        setScholarships(scholarshipsData || []);
        setApplications(applicationsData || []);
      } catch (err) {
        console.error('Error fetching scholarship data:', err);
      }
    };
    fetchData();
  }, [getAvailableScholarships, getScholarshipApplications]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedScholarship || selectedFiles.length === 0) {
      setFormError('Please select a scholarship and upload documents.');
      return;
    }
    setFormError(null);

    const documentUrls = await Promise.all(
      selectedFiles.map((file) => uploadDocument(file, 'scholarship'))
    );

    if (documentUrls.every((url) => url !== null)) {
      const application = {
        scholarshipId: selectedScholarship.id,
        studentId: 'current-user-id', // Replace with auth context
        documents: documentUrls.map((url, index) => ({
          name: selectedFiles[index].name,
          url: url.url,
        })),
      };

      const result = await applyForScholarship(application);
      if (result) {
        setApplications([...applications, result]);
        setSelectedScholarship(null);
        setSelectedFiles([]);
        setShowScholarships(true);
      }
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
                <FaAward size={20} className="text-white relative z-10" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Scholarships
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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
        <div className="relative z-10 p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-gray-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {!showScholarships ? (
                <button
                  onClick={() => setShowScholarships(true)}
                  className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 sm:py-3 px-6 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <span>View Scholarships</span>
                  <FaAward size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scholarships.length === 0 ? (
                      <p className="text-gray-600 text-sm col-span-2">No scholarships available.</p>
                    ) : (
                      scholarships.map((scholarship) => (
                        <div
                          key={scholarship.id || scholarship.name}
                          className="relative overflow-hidden rounded-lg bg-amber-50 p-4 border border-amber-200/50 group/item hover:border-orange-200/50 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
                          <div className="relative z-10">
                            <h5 className="font-medium text-orange-700">{scholarship.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{scholarship.description}</p>
                            <p className="text-orange-600 font-medium mt-2">
                              Amount: ${scholarship.amount?.toLocaleString()}
                            </p>
                            <button
                              onClick={() => setSelectedScholarship(scholarship)}
                              className="group mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm"
                            >
                              <span>Apply Now</span>
                              <FaAward size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {selectedScholarship && (
                    <div className="relative overflow-hidden rounded-lg bg-amber-50 p-4 border border-amber-200/50 group/item hover:border-orange-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
                      <div className="relative z-10">
                        <h5 className="font-medium text-orange-700 mb-3">
                          Apply for {selectedScholarship.name}
                        </h5>
                        <form onSubmit={handleApply} className="space-y-4">
                          {formError && (
                            <div className="p-3 bg-gray-200 text-red-600 rounded-lg text-sm">
                              {formError}
                            </div>
                          )}
                          <div>
                            <label
                              htmlFor="scholarshipDocs"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Supporting Documents
                            </label>
                            <input
                              type="file"
                              multiple
                              id="scholarshipDocs"
                              onChange={handleFileChange}
                              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-amber-200 file:text-orange-800 file:font-medium hover:file:bg-amber-300 transition-all duration-200"
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
                          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-amber-100/50">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedScholarship(null);
                                setSelectedFiles([]);
                                setFormError(null);
                              }}
                              disabled={loading}
                              className="group px-4 py-2 sm:bg-white/50 backdrop-blur-md border border-amber-200/50 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base sm:flex sm:items-center sm:justify-center sm:space-x-2"
                            >
                              <span>Cancel</span>
                              <FaTimes size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="group px-4 py-2 sm:bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed sm:text-base sm:flex sm:items-center sm:justify-center sm:space-x-2"
                            >
                              <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
                              <FaAward size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {applications.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-orange-700 mb-4">My Applications</h4>
                      <div className="space-y-4">
                        {applications.map((application) => (
                          <div
                            key={application.id || application.scholarshipId + application.applicationDate}
                            className="relative overflow-hidden rounded-lg bg-amber-50 p-4 border border-amber-200/50 group hover:shadow-lg transition-all duration-300"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
                            <div className="relative z-10">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                  <h5 className="font-medium text-orange-700">
                                    {scholarships.find((s) => s.id === application.scholarshipId)?.name ||
                                      'Unknown Scholarship'}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    Applied: {new Date(application.applicationDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
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
                                  <h6 className="text-sm font-medium text-orange-700">Documents:</h6>
                                  <ul className="mt-1 space-y-1">
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}