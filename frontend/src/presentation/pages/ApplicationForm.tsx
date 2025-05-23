import React, { useEffect, useState, useRef } from 'react';
import { FormTabs } from '../components/form/formTabs';
import { PersonalParticularsForm } from '../components/form/Personal_Particulars/PersonalParticularsForm';
import { ChoiceOfStudy } from '../components/form/Choice_of_Studies/ChoiceOfStudy';
import { Education } from '../components/form/Education/Education';
import { Achievements } from '../components/form/Achievements/Achievements';
import { Documents, DocumentUploadSection } from '../components/form/Documents/Documents';
import { Declaration } from '../components/form/Declaration';
import { AchievementSection, DeclarationSection, EducationData, OtherInformationSection, PersonalInfo, ProgrammeChoice } from '../../domain/types/formTypes';
import Other_Info from '../components/form/Other_Information/Other_Info';
import { FormSubmissionFlow } from '../components/form/FormSubmissionFlow';
import { useApplicationForm, useApplicationData } from '../../application/hooks/useApplicationForm';
import styles from './ApplicationForm.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const useAuth = () => {
  const { token, user, collection } = useSelector((state: RootState) => state.auth);
  return { token, user, collection };
};

interface FormData {
  applicationId?: string;
  personalInfo?: PersonalInfo;
  choiceOfStudy?: ProgrammeChoice[];
  education?: EducationData;
  achievements?: AchievementSection;
  otherInformation?: OtherInformationSection;
  documents?: DocumentUploadSection;
  declaration?: DeclarationSection;
  registerId?: string;
}

export const ApplicationForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personalDetails');
  const [formProgress, setFormProgress] = useState(0);
  const [wavePosition, setWavePosition] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [validationAttempted, setValidationAttempted] = useState(false);

  const personalFormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const educationFormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const achievementsFormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const documentsFormRef = useRef<{ trigger: () => Promise<boolean> }>(null);
  const choiceOfStudyRef = useRef<{ trigger: () => Promise<boolean> }>(null);

  const { token, user, collection } = useAuth();
  const [applicationId, setApplicationId] = useState<string | undefined>(undefined);

  const methods = useForm<FormData>({
    defaultValues: {
    applicationId: '',
    personalInfo: undefined,
      choiceOfStudy: [],
      education: undefined,
    achievements: {
      questions: { 1: '', 2: '', 3: '', 4: '', 5: '' },
      achievements: [],
      hasNoAchievements: false,
      showModal: false,
        newAchievement: [],
        referenceContact: {
          firstName: '',
          lastName: '',
          position: '',
          email: '',
          phone: { country: '', area: '', number: '' },
        },
        editingIndex: null,
    },
    otherInformation: undefined,
    documents: undefined,
    declaration: { privacyPolicy: false, marketingEmail: false, marketingCall: false },
      registerId: user?.id,
    },
    mode: 'onSubmit',
  });

  const { setValue, watch, trigger } = methods;
  const formData = watch();

  const {
    createApplication,
    savePersonalInfo,
    saveChoiceOfStudy,
    saveEducation,
    saveAchievements,
    saveOtherInfo,
    saveDocuments,
    saveDeclaration,
    isLoading: isSaving,
  } = useApplicationForm(token);

  const { data: fetchedData, isLoading: isFetching, error: fetchError } = useApplicationData(user?.id, token);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) {
      console.log('No auth token or user found, redirecting to login');
      navigate('/login');
        return;
      }

    if (collection !== 'register') {
      console.log('User is not in register collection, redirecting to appropriate dashboard');
      switch (collection) {
        case 'admin':
          navigate('/admin');
          break;
        case 'user':
          navigate('/dashboard');
          break;
        case 'faculty':
          navigate('/faculty/courses');
          break;
        default:
          navigate('/');
      }
    }
  }, [token, user, collection, navigate]);

  useEffect(() => {
    const initializeApplication = async () => {
      if (isFetching) return; 

      if (fetchError) {
        setSaveError('Failed to load application data. Please try again.');
        setIsInitializing(false);
        return;
      }

      if (fetchedData && fetchedData.applicationId) {
        // Existing application found
        setApplicationId(fetchedData.applicationId);
        setValue('applicationId', fetchedData.applicationId, { shouldValidate: false });
      } else {
        try {
          const response = await createApplication(user.id); 
          setApplicationId(response.applicationId);
          setValue('applicationId', response.applicationId, { shouldValidate: false });
        } catch (error) {
          console.error('Failed to create application:', error);
          setSaveError('Failed to initialize application. Please try again.');
        }
      }
      setIsInitializing(false);
    };
    initializeApplication();
  }, [fetchedData, isFetching, fetchError, user.id, createApplication, setValue]);

  useEffect(() => {
    if (fetchedData) {
      console.log('Fetched data:', fetchedData);
      setValue('applicationId', fetchedData.applicationId ?? '', { shouldValidate: false });
      if (fetchedData.personal) {
        setValue('personalInfo', fetchedData.personal, { shouldValidate: false });
      } else {
        setValue('personalInfo', undefined, { shouldValidate: false });
      }
      if (fetchedData.choiceOfStudy) setValue('choiceOfStudy', fetchedData.choiceOfStudy, { shouldValidate: false });
      if (fetchedData.education) setValue('education', fetchedData.education, { shouldValidate: false });
      if (fetchedData.achievements) setValue('achievements', fetchedData.achievements, { shouldValidate: false });
      if (fetchedData.otherInformation) setValue('otherInformation', fetchedData.otherInformation, { shouldValidate: false });
      if (fetchedData.documents) setValue('documents', fetchedData.documents, { shouldValidate: false });
      if (fetchedData.declaration) setValue('declaration', fetchedData.declaration, { shouldValidate: false });
      calculateFormProgress(fetchedData);
    }
  }, [fetchedData, setValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWavePosition((prev) => (prev + 1) % 100);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const calculateFormProgress = (data: FormData) => {
    const sections = ['personalInfo', 'choiceOfStudy', 'education', 'achievements', 'otherInformation', 'documents', 'declaration'];
    const completedSections = sections.filter(section => !!data[section as keyof FormData]);
    const progress = Math.floor((completedSections.length / sections.length) * 100);
    setFormProgress(progress);
  };

  const tabs = [
    { id: 'personalDetails', label: 'Personal Details', isActive: activeTab === 'personalDetails' },
    { id: 'choiceOfStudy', label: 'Choice of Study', isActive: activeTab === 'choiceOfStudy' },
    { id: 'education', label: 'Education', isActive: activeTab === 'education' },
    { id: 'achievements', label: 'Achievements', isActive: activeTab === 'achievements' },
    { id: 'otherInformation', label: 'Other Information', isActive: activeTab === 'otherInformation' },
    { id: 'documents', label: 'Documents', isActive: activeTab === 'documents' },
    { id: 'declaration', label: 'Declaration', isActive: activeTab === 'declaration' },
  ];

  const handleNextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      setFormProgress(Math.floor(((currentIndex + 1) / (tabs.length - 1)) * 100));
      setValidationAttempted(false);
      setSaveError(null);
    }
  };

  const handleSavePersonalInfo = async () => {
    if (isInitializing) {
      console.log('Waiting for application initialization');
      return;
    }
    if (!formData.applicationId || !formData.personalInfo) {
      setSaveError('No application ID or personal info found.');
      console.error('Missing applicationId or personalInfo:', {
        applicationId: formData.applicationId,
        personalInfo: formData.personalInfo
      });
      return;
    }
    try {
      setSaveError(null);
      console.log('Saving personalInfo to backend:', formData.personalInfo);
      await savePersonalInfo({ applicationId: formData.applicationId, data: formData.personalInfo });
      console.log('Personal info saved successfully');
      calculateFormProgress(formData);
    } catch (error) {
      console.error('Error saving personalInfo:', error);
      setSaveError('Failed to save personal information. Please try again.');
    }
  };

  const handleUpdateChoiceOfStudy = async (choices: ProgrammeChoice[]) => {
    if (isInitializing) {
      console.log('Waiting for application initialization');
      return;
    }
    if (!formData.applicationId) {
      setSaveError('No application ID found.');
      return;
    }
    try {
      setSaveError(null);
      // Save to backend first
      await saveChoiceOfStudy({ applicationId: formData.applicationId, data: choices });
      console.log('Choice of study saved to backend:', choices);
      // Then update form data
      setValue('choiceOfStudy', choices, { shouldValidate: false });
      calculateFormProgress({ ...formData, choiceOfStudy: choices });
    } catch (error) {
      console.error('Error saving choiceOfStudy:', error);
      setSaveError('Failed to update choice of study. Please try again.');
      throw error; // Re-throw to prevent form progression
    }
  };

  const handleUpdateEducation = async (data: EducationData) => {
    if (isInitializing) {
      console.log('Waiting for application initialization');
      return;
    }
    if (!formData.applicationId) {
      setSaveError('No application ID found.');
      return;
    }
    try {
      setSaveError(null);
      console.log('handleUpdateEducation called with data:', data);
      setValue('education', data, { shouldValidate: false });
      await saveEducation({ applicationId: formData.applicationId, data });
      console.log('Education saved to backend:', data);
      calculateFormProgress({ ...formData, education: data });
    } catch (error) {
      console.error('Error saving education:', error);
      setSaveError('Failed to update education details. Please try again.');
    }
  };

  const handleUpdateAchievements = async (data: AchievementSection, validate: boolean = false) => {
    if (isInitializing) {
      console.log('Waiting for application initialization');
      return;
    }
    if (!formData.applicationId) {
      setSaveError('No application ID found.');
      return;
    }

    try {
      setSaveError(null);
      console.log('Saving achievements to backend:', data);
      
      // Save to backend first
      await saveAchievements({ applicationId: formData.applicationId, data });
      console.log('Achievements saved successfully');
      
      // Then update form data
      setValue('achievements', data, { shouldValidate: false });
      calculateFormProgress({ ...formData, achievements: data });
    } catch (error) {
      console.error('Error saving achievements:', error);
      setSaveError('Failed to update achievements. Please try again.');
      throw error; // Re-throw to prevent form progression
    }
  };

  const handleUpdateOtherInformation = async (data: OtherInformationSection) => {
    if (isInitializing) {
      console.log('Waiting for application initialization');
      return;
    }
    if (!formData.applicationId) {
      setSaveError('No application ID found.');
      return;
    }
    try {
      setSaveError(null);
      setValue('otherInformation', data, { shouldValidate: false });
      console.log('Updated otherInformation:', data);
      await saveOtherInfo({ applicationId: formData.applicationId, data });
      console.log('Other information saved successfully');
      calculateFormProgress({ ...formData, otherInformation: data });
    } catch (error) {
      console.error('Error saving otherInformation:', error);
      setSaveError('Failed to update other information. Please try again.');
    }
  };

  const handleSaveDocuments = async (data: DocumentUploadSection) => {
    if (isInitializing) {
      console.log('Waiting for application initialization');
      return;
    }
    if (!formData.applicationId) {
      setSaveError('No application ID found.');
      return;
    }
    try {
      setSaveError(null);
      setValue('documents', data, { shouldValidate: false });
      console.log('Updated documents:', data);
      await saveDocuments({ applicationId: formData.applicationId, data });
      console.log('Documents saved successfully');
      calculateFormProgress({ ...formData, documents: data });
    } catch (error) {
      console.error('Error saving documents:', error);
      setSaveError('Failed to update documents. Please try again.');
    }
  };

  const handleUpdateDeclaration = async (data: DeclarationSection) => {
    if (isInitializing) {
      console.log('Waiting for application initialization');
      return;
    }
    if (!formData.applicationId) {
      setSaveError('No application ID found.');
      return;
    }
    try {
      setSaveError(null);
      setValue('declaration', data, { shouldValidate: false });
      console.log('Updated declaration:', data);
      await saveDeclaration({ applicationId: formData.applicationId, data });
      console.log('Declaration saved successfully');
      calculateFormProgress({ ...formData, declaration: data });
    } catch (error) {
      console.error('Error saving declaration:', error);
      setSaveError('Failed to update declaration. Please try again.');
    }
  };

 const handleSaveCurrentTab = async () => {
    if (isInitializing) {
      console.log('Waiting for application initialization');
      return;
    }
    if (!formData.applicationId) {
      setSaveError('No application ID found.');
      console.error('applicationId missing in handleSaveCurrentTab');
      return;
    }

    console.log('handleSaveCurrentTab: Saving tab:', activeTab, 'formData:', formData);

    if (activeTab === 'personalDetails') {
      setValidationAttempted(true);
      if (personalFormRef.current) {
        const isValid = await personalFormRef.current.trigger();
        console.log('PersonalDetails validation result:', { isValid, personalInfo: formData.personalInfo });
        if (isValid && formData.personalInfo && Object.values(formData.personalInfo).some(val => val !== '' && val !== undefined && val !== null)) {
          console.log('Proceeding to save personal info');
          await handleSavePersonalInfo();
          console.log('personalInfo saved:', formData.personalInfo);
          handleNextTab();
        } else {
          console.log('Form validation failed or personalInfo is empty, staying on personalDetails tab');
          toast.error('Please fill in the required personal information fields.');
        }
      } else {
        console.error('personalFormRef.current is null');
        toast.error('Personal form reference is missing. Please try again.');
      }
    } else if (activeTab === 'choiceOfStudy') {
      setValidationAttempted(true);
      if (choiceOfStudyRef.current) {
        const isValid = await choiceOfStudyRef.current.trigger();
        console.log('ChoiceOfStudy validation result:', { isValid, choiceOfStudy: formData.choiceOfStudy });
      if (isValid) {
          try {
            await handleUpdateChoiceOfStudy(formData.choiceOfStudy || []);
        handleNextTab();
          } catch (error) {
            console.error('Error saving choice of study:', error);
            setSaveError('Failed to save choice of study. Please try again.');
          }
      } else {
        toast.error('Please add at least one programme choice.');
        }
      }   
    } else if (activeTab === 'education') {
      setValidationAttempted(true);
      if (educationFormRef.current) {
        const isValid = await educationFormRef.current.trigger();
        console.log(formData, "formData.education")
        console.log('Education validation result:', { isValid, education: formData.education });
        if (isValid && formData.education?.studentType) {
          await saveEducation({ applicationId: formData.applicationId, data: formData.education });
          console.log('education saved:', formData.education);
          handleNextTab();
        } else {
          toast.error(
            formData.education?.studentType === 'international' && !isValid
              ? 'Please complete all required education details, including at least one English proficiency test.'
              : 'Please complete all required education details, including student type.'
          );
        }
      } else {
        console.error('educationFormRef.current is null');
        toast.error('Education form reference is missing. Please try again.');
      }
    } else if (activeTab === 'achievements') {
      setValidationAttempted(true);
      if (achievementsFormRef.current) {
        const isValid = await achievementsFormRef.current.trigger();
        console.log('Achievements validation result:', { isValid, achievements: formData.achievements });
        if (isValid && formData.achievements) {
          try {
            // Save to backend
            await handleUpdateAchievements(formData.achievements, true);
            console.log('achievements saved successfully');
            
          if (!saveError) {
            handleNextTab();
            }
          } catch (error) {
            console.error('Error saving achievements:', error);
            setSaveError('Failed to save achievements. Please try again.');
          }
        } else {
          toast.error(
            formData.achievements?.hasNoAchievements
              ? 'Please complete all required questions.'
              : 'Please add at least one achievement or select "No Achievements to Report".'
          );
        }
      } else {
        console.error('achievementsFormRef.current is null');
        toast.error('Achievements form reference is missing. Please try again.');
      }
    } else if (activeTab === 'otherInformation') {
      setValidationAttempted(true);
      const isValid = !!formData.otherInformation;
      console.log('OtherInformation validation result:', { isValid, otherInformation: formData.otherInformation });
      if (isValid && formData.otherInformation) {
        await saveOtherInfo({ applicationId: formData.applicationId, data: formData.otherInformation });
        console.log('otherInformation saved:', formData.otherInformation);
        handleNextTab();
      } else {
        toast.error('Please complete the Other Information section.');
      }
    } else if (activeTab === 'documents') {
      setValidationAttempted(true);
      console.log('documentsFormRef:', documentsFormRef);
      if (documentsFormRef.current) {
        console.log('Validating documents form');
        const isValid = await documentsFormRef.current.trigger();
        console.log('Documents validation result:', { isValid, documents: formData.documents });
        if (isValid && formData.documents) {
          await saveDocuments({ applicationId: formData.applicationId, data: formData.documents });
          console.log('documents saved:', formData.documents);
          handleNextTab();
        } else {
          toast.error('Please upload all required documents.');
        }
      } else {
        console.error('documentsFormRef.current is null');
        toast.error('Documents form reference is missing. Please try again.');
      }
    } else if (activeTab === 'declaration') {
      setValidationAttempted(true);
      const isValid = formData.declaration?.privacyPolicy === true;
      console.log('Declaration validation result:', { isValid, declaration: formData.declaration });
      if (isValid && formData.declaration) {
        await saveDeclaration({ applicationId: formData.applicationId, data: formData.declaration });
        console.log('declaration saved:', formData.declaration);
        handleNextTab();
      } else {
        toast.error('Please agree to the Privacy Notice to proceed.');
      }
    }
  };

  const handleSubmitApplication = async () => {
    if (isInitializing) {
      console.log('Waiting for application initialization');
      return;
    }

    if (!formData.applicationId) {
      toast.error('No application ID found.');
      return;
    }

    const validationResults = await Promise.all([
      Promise.resolve(!!formData.personalInfo),
      Promise.resolve(!!(formData.choiceOfStudy && formData.choiceOfStudy.length > 0)),
      Promise.resolve(!!formData.education),
      Promise.resolve(!!formData.achievements),
      Promise.resolve(!!formData.otherInformation),
      Promise.resolve(!!formData.documents),
      Promise.resolve(!!formData.declaration?.privacyPolicy),
    ]);

    console.log('Full form validation results:', validationResults);

    if (validationResults.every(result => result === true)) {
      try {
        setSaveError(null);
        await handleUpdateDeclaration(formData.declaration!);
        setShowSummary(true);
      } catch (error) {
        console.error('Error saving declaration:', error);
        setSaveError('Failed to submit application. Please try again.');
      }
    } else {
      setSaveError('Please complete all required fields in the form.');
      const invalidSectionIndex = validationResults.findIndex(result => result === false);
      if (invalidSectionIndex !== -1) {
        setActiveTab(tabs[invalidSectionIndex].id);
        console.log('Navigating to invalid section:', tabs[invalidSectionIndex].id);
      } 
    }
  };

  if (isInitializing || isFetching) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-cyan-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-700 text-lg">Loading application...</p>
        </div>
      </div>
    );
  }

  if (fetchError || (saveError && validationAttempted)) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {fetchError ? 'Error loading your application. Please refresh the page or try again later.' : saveError}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                You must be logged in to access the application form.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <FormSubmissionFlow
        formData={formData}
        onConfirm={() => {
          setShowSummary(false);
          setShowPayment(true);
        }}
        onBackToForm={() => setShowSummary(false)}
        token={token}
        isPayment={false}
      />
    );
  }

  if (showPayment) {
      return (
      <FormSubmissionFlow
        formData={{
          ...formData,
          registerId: user?.id
        }}
          onPaymentComplete={() => {
            setShowPayment(false);
            setActiveTab('personalDetails');
            setApplicationId(undefined);
          setValue('applicationId', '', { shouldValidate: false });
          setValue('personalInfo', undefined, { shouldValidate: false });
          setValue('choiceOfStudy', [], { shouldValidate: false });
          setValue('education', undefined, { shouldValidate: false });
          setValue('achievements', undefined, { shouldValidate: false });
          setValue('otherInformation', undefined, { shouldValidate: false });
          setValue('documents', undefined, { shouldValidate: false });
          setValue('declaration', { privacyPolicy: false, marketingEmail: false, marketingCall: false }, { shouldValidate: false });
        }}
        token={token}
        isPayment={true}
      />
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div
          className="relative overflow-hidden bg-gradient-to-r from-cyan-100 to-blue-200 p-8 rounded-xl shadow-md mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(224,242,254,0.8) 0%, rgba(186,230,253,0.9) 100%)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div
              className={`absolute inset-x-0 bottom-0 h-16 bg-white/20 ${styles.wave}`}
              style={{
                transform: `translateX(${wavePosition}%)`,
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z\' fill=\'%23ffffff\'%3E%3C/path%3E%3C/svg%3E")',
                backgroundSize: '1200px 100%',
              }}
            ></div>
            <div
              className={`absolute inset-x-0 bottom-0 h-24 bg-white/10 ${styles.waveReverse}`}
              style={{
                transform: `translateX(-${wavePosition}%)`,
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z\' fill=\'%23ffffff\'%3E%3C/path%3E%3C/svg%3E")',
                backgroundSize: '1200px 100%',
              }}
            ></div>
          </div>
          <div className="relative">
            <h1 className="text-3xl font-bold text-cyan-800 mb-2 flex items-center">
              <span className="mr-2">Your Journey Begins Here</span>
              <span className="inline-block w-2 h-8 bg-cyan-400 animate-pulse"></span>
            </h1>
            <p className="text-cyan-700 text-lg font-light">Complete all sections to submit your application</p>
            <div className="w-full bg-cyan-200/70 rounded-full h-3 mt-6 overflow-hidden">
              <div
                className={`bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-700 relative ${styles.shimmer}`}
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
            <div className="text-right text-cyan-700 text-sm mt-2 font-light">{formProgress}% Complete</div>
          </div>
        </div>

        {formData.applicationId && (
          <div className="mb-4 text-center">
            <p className="text-sm text-cyan-700 bg-cyan-50 inline-block px-4 py-2 rounded-full">
              Application ID: <span className="font-medium">{formData.applicationId}</span>
              <span className="ml-2 text-xs text-cyan-500">(Save this ID to continue your application later)</span>
            </p>
          </div>
        )}

        <FormTabs tabs={tabs} />
        <div className="bg-white shadow-sm p-6 rounded-xl border border-cyan-100 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cyan-50/10 -z-10"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(186,230,253,0.1) 0%, rgba(224,242,254,0.05) 35%, rgba(255,255,255,0) 70%)',
            }}
          ></div>
          <div className="mb-4 border-b border-cyan-50 pb-4">
            <h2 className="text-2xl font-bold text-cyan-800 flex items-center">
              <span>{tabs.find((tab) => tab.id === activeTab)?.label}</span>
              <span className="ml-2 text-cyan-300 text-lg font-light">/</span>
              <span className="ml-2 text-cyan-400 text-sm font-light">
                Step {tabs.findIndex((tab) => tab.id === activeTab) + 1} of {tabs.length}
              </span>
            </h2>
            <p className="text-cyan-600 mt-1 text-sm">
              {activeTab === 'personalDetails' && 'Tell us about yourself'}
              {activeTab === 'choiceOfStudy' && 'Select your preferred program'}
              {activeTab === 'education' && 'Share your educational background'}
              {activeTab === 'achievements' && 'Highlight your accomplishments'}
              {activeTab === 'otherInformation' && 'Additional details that might support your application'}
              {activeTab === 'documents' && 'Upload supporting documents'}
              {activeTab === 'declaration' && 'Review and confirm your application'}
            </p>
          </div>
          {activeTab === 'personalDetails' && (
            <PersonalParticularsForm
              initialData={formData.personalInfo}
              onChange={(data) => {
                console.log('PersonalParticularsForm onChange:', data);
                setValue('personalInfo', data, { shouldValidate: false });
                calculateFormProgress({ ...formData, personalInfo: data });
              }}
              triggerValidation={personalFormRef}
            />
          )}
          {activeTab === 'choiceOfStudy' && (
            <ChoiceOfStudy
              initialData={formData.choiceOfStudy}
              onSave={handleUpdateChoiceOfStudy}
              ref={choiceOfStudyRef}
            />
          )}
              {activeTab === 'education' && (
            <Education
              initialData={formData.education}
              onSave={handleUpdateEducation}
              ref={educationFormRef}
            />
          )}
          {activeTab === 'achievements' && (
            <Achievements
              initialData={formData.achievements}
              onSave={handleUpdateAchievements}
              ref={achievementsFormRef}
            />
          )}
          {activeTab === 'otherInformation' && (
            <Other_Info
              initialData={formData.otherInformation}
              onSave={handleUpdateOtherInformation}
            />
          )}
          {activeTab === 'documents' && (
            <Documents
              initialData={formData.documents}
              onSave={handleSaveDocuments}
              ref={documentsFormRef}
            />
          )}
          {activeTab === 'declaration' && (
            <Declaration
              value={formData.declaration || { privacyPolicy: false, marketingEmail: false, marketingCall: false }}
              onChange={handleUpdateDeclaration}
            />
          )}
          <div className="flex justify-between mt-8 border-t border-cyan-50 pt-6">
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].id);
                  setFormProgress(Math.floor(((currentIndex - 1) / (tabs.length - 1)) * 100));
                }
              }}
              disabled={activeTab === 'personalDetails'}
              className={`px-6 py-3 rounded-lg flex items-center transition-all duration-300 ${activeTab === 'personalDetails'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 hover:shadow-sm'
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </button>
            {activeTab !== 'declaration' ? (
              <button
                onClick={handleSaveCurrentTab}
                disabled={isSaving}
                className={`px-6 py-3 rounded-lg flex items-center transition-all duration-300 shadow-sm relative overflow-hidden group ${isSaving ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500'
                  }`}
              >
                <span className={`relative z-10 flex items-center ${styles.shimmer}`}>
                  Save & Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            ) : (
              <button
                className={`px-8 py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-lg font-bold relative overflow-hidden group transition-all duration-300 shadow-sm ${!formData.declaration?.privacyPolicy || isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-500 hover:to-cyan-700'
                  }`}
                disabled={!formData.declaration?.privacyPolicy || isSaving}
                onClick={handleSubmitApplication}
              >
                <span className={`relative z-10 flex items-center ${styles.shimmer}`}>
                  Submit Application
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
};