// for education.ts
export const studentTypeOptions = [
  { value: "local", label: "Local Student" },
  { value: "transfer", label: "Transfer Student" },
  { value: "international", label: "International Student" },
];



// for internationaSchoolInfo.ts / localEducatio.ts / transferEducation.tsx
export const countryOptions = [
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "in", label: "India" },
  { value: "cn", label: "China" },
  { value: "us", label: "United States" },
];




// for transferEducation.tsx
export const universityOptions = [
  { value: "other", label: "Other" },
  { value: "nus", label: "National University of Singapore" },
  { value: "ntu", label: "Nanyang Technological University" },
  { value: "smu", label: "Singapore Management University" },
];


// for internationalSchoolInfo
export const examOptions = [
  { value: 'ib', label: 'International Baccalaureate (IB)' },
  { value: 'alevel', label: 'GCE A-Level' },
  { value: 'olevel', label: 'GCE O-Level' },
  { value: 'sat', label: 'SAT' },
  { value: 'act', label: 'ACT' },
  { value: 'ap', label: 'Advanced Placement (AP)' },
  { value: 'other', label: 'Other High School Qualification' },
];



// for subjectmodal.tsx
export const subjectFields = [
  {
    id: 'subject',
    label: 'Subject',
    required: true,
    placeholder: 'Enter subject',
  },
  {
    id: 'otherSubject',
    label: 'Other Subject',
    required: false,
    placeholder: 'Enter other subject',
  },
  {
    id: 'marksObtained',
    label: 'Marks Obtained',
    required: true,
    placeholder: 'Enter marks obtained',
  },
  {
    id: 'maxMarks',
    label: 'Maximum Marks',
    required: true,
    placeholder: 'Enter maximum marks',
  },
];



// for mappedtestsection.tsx
export const testConfigs = [
  {
    testName: 'EL1119',
    fields: [
      {
        id: 'el1119Date',
        label: 'Date Taken',
        placeholder: 'MM/YYYY',
      },
      {
        id: 'el1119Grade',
        label: 'Grade/Mark',
        placeholder: 'Enter grade or mark',
      },
    ],
  },
  {
    testName: 'Tahap Keseluruhan CEFR Bahasa Inggeris',
    fields: [
      {
        id: 'ceferDate',
        label: 'Date Taken',
        placeholder: 'MM/YYYY',
      },
      {
        id: 'ceferGrade',
        label: 'Grade/Mark',
        placeholder: 'Enter grade or mark',
      },
    ],
  },
  {
    testName: 'MUET (Aggregate Score)',
    fields: [
      {
        id: 'muetDate',
        label: 'Date Taken',
        placeholder: 'MM/YYYY',
      },
      {
        id: 'muetGrade',
        label: 'Grade/Mark',
        placeholder: 'Enter grade or mark',
      },
    ],
  },
  {
    testName: 'C1 Advanced/Cambridge English Advanced',
    fields: [
      {
        id: 'cambridgeDate',
        label: 'Date Taken',
        placeholder: 'MM/YYYY',
      },
      {
        id: 'cambridgeGrade',
        label: 'Grade/Mark',
        placeholder: 'Enter grade or mark',
      },
    ],
  },
];