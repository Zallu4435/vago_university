import { Question } from "../../../../domain/types/application";

// for modal
export const activityOptions = [
    { value: '', label: 'Please select' },
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'arts', label: 'Arts' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'community', label: 'Community Service' },
  ];
  
  export const positionOptions = [
    { value: '', label: 'Please select' },
    { value: 'president', label: 'President' },
    { value: 'vicePresident', label: 'Vice President' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'member', label: 'Member' },
  ];
  
  export const levelOptions = [
    { value: '', label: 'Please select' },
    { value: 'international', label: 'International' },
    { value: 'national', label: 'National' },
    { value: 'state', label: 'State' },
    { value: 'school', label: 'School' },
  ];
  
  export const levelOfAchievementOptions = [
    { value: '', label: 'Please select' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'bronze', label: 'Bronze' },
    { value: 'participation', label: 'Participation' },
  ];




  // for achievement List
  export const columns = [
    { key: 'index', label: '#', width: '60px' },
    { key: 'activity', label: 'Activity Type', width: '150px' },
    { key: 'level', label: 'Level', width: '120px' },
    { key: 'levelOfAchievement', label: 'Achievement Level', width: '150px' },
    { key: 'positionHeld', label: 'Position', width: '150px' },
    { key: 'organizationName', label: 'Organization', width: '200px' },
    { key: 'fromDate', label: 'From', width: '100px' },
    { key: 'toDate', label: 'To', width: '100px' },
    { key: 'description', label: 'Description', width: '300px' },
  ];
  



  // for Questions

export const questions: Question[] = [
  {
    id: 1,
    question: "Tell us something you have done outside your school curriculum to prepare yourself for your chosen degree programme(s).",
    maxLength: 600
  },
  {
    id: 2,
    question: "Describe an instance when you did not succeed in accomplishing something on your first attempt but succeeded on subsequent attempts. How and what did you learn from your initial failure, and what changes did you make to your approach to eventually succeed?",
    maxLength: 600
  },
  {
    id: 3,
    question: "Share something that is meaningful to you and explain how it has impacted you in a concrete way.",
    maxLength: 600
  },
  {
    id: 4,
    question: "What is your proudest achievement, and how did you accomplish it with the help or inspiration from others? Please also explain how it exemplifies some of the five NUS values of Innovation, Resilience, Excellence, Respect and Integrity.",
    maxLength: 1100
  },
  {
    id: 5,
    question: "Is there anything else about yourself which you want us to know?",
    maxLength: 600,
    hint: "Refer to the examples provided in this link"
  }
];
