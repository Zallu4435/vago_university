import { useState, useEffect } from 'react';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import { Scholarship, ScholarshipApplication } from '../../../../domain/types/financial';

export default function ScholarshipsSection() {
  const {
    getAvailableScholarships,
    getScholarshipApplications,
    applyForScholarship,
    uploadDocument,
    loading,
    error
  } = useFinancial();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [showScholarships, setShowScholarships] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [scholarshipsData, applicationsData] = await Promise.all([
        getAvailableScholarships(),
        getScholarshipApplications()
      ]);
      if (scholarshipsData) setScholarships(scholarshipsData);
      if (applicationsData) setApplications(applicationsData);
    };
    fetchData();
  }, [getAvailableScholarships, getScholarshipApplications]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScholarship) return;

    const documentUrls = await Promise.all(
      selectedFiles.map(file => uploadDocument(file, 'scholarship'))
    );

    if (documentUrls.every(url => url !== null)) {
      const application = {
        scholarshipId: selectedScholarship.id,
        studentId: 'current-user-id', // This should come from auth context
        documents: documentUrls.map((url, index) => ({
          name: selectedFiles[index].name,
          url: url!.url
        }))
      };

      const result = await applyForScholarship(application);
      if (result) {
        setApplications([...applications, result]);
        setSelectedScholarship(null);
        setSelectedFiles([]);
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-4 mb-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Scholarships</h3>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-orange-800 mb-4">Scholarship Opportunities</h4>
        <p className="text-gray-600">Explore available scholarships and track your applications here.</p>
        
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="mt-4">
            {!showScholarships ? (
              <button 
                onClick={() => setShowScholarships(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md"
              >
                View Scholarships
              </button>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scholarships.map((scholarship) => (
                    <div key={scholarship.id} className="border border-amber-200 rounded-lg p-4">
                      <h5 className="font-medium text-orange-800">{scholarship.name}</h5>
                      <p className="text-gray-600 mt-1">{scholarship.description}</p>
                      <p className="text-orange-600 font-medium mt-2">Amount: ${scholarship.amount.toLocaleString()}</p>
                      <button
                        onClick={() => setSelectedScholarship(scholarship)}
                        className="mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>

                {selectedScholarship && (
                  <div className="border border-amber-200 rounded-lg p-4">
                    <h5 className="font-medium text-orange-800 mb-3">Apply for {selectedScholarship.name}</h5>
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label className="block text-orange-800 font-medium mb-1">Supporting Documents:</label>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                        {selectedFiles.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {selectedFiles.map((file, index) => (
                              <li key={index} className="text-sm text-gray-600">• {file.name}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                        >
                          {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedScholarship(null);
                            setSelectedFiles([]);
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {applications.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-medium text-orange-800 mb-3">My Applications</h5>
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div key={application.id} className="border border-amber-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="font-medium text-orange-800">
                                {scholarships.find(s => s.id === application.scholarshipId)?.name}
                              </h6>
                              <p className="text-gray-600">Applied: {new Date(application.applicationDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          {application.documents.length > 0 && (
                            <div className="mt-2">
                              <h6 className="text-sm font-medium text-orange-800">Documents:</h6>
                              <ul className="mt-1 space-y-1">
                                {application.documents.map((doc) => (
                                  <li key={doc.id} className="flex items-center text-sm text-gray-600">
                                    <span className="mr-2">•</span>
                                    <a 
                                      href={doc.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-orange-600 hover:text-orange-800"
                                    >
                                      {doc.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}