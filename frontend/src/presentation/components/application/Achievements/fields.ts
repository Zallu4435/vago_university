import { Achievement, ReferenceContact } from '../../../../domain/types/application';

export const getSelectFields = (
  newAchievement: Achievement,
  onChange: (a: Achievement) => void
) => [
  {
    id: 'activity',
    label: 'Activity',
    options: [
      { value: '', label: 'Select Activity' },
      { value: 'Sports', label: 'Sports' },
      { value: 'Arts', label: 'Arts' },
      { value: 'Leadership', label: 'Leadership' },
      { value: 'Work Experience', label: 'Work Experience' },
      { value: 'Other', label: 'Other' },
    ],
    value: newAchievement?.activity || '',
    onChange: (value: string) => onChange({ ...newAchievement, activity: value }),
    placeholder: 'Select Activity',
  },
  {
    id: 'level',
    label: 'Level',
    options: [
      { value: '', label: 'Select Level' },
      { value: 'School', label: 'School' },
      { value: 'Regional', label: 'Regional' },
      { value: 'National', label: 'National' },
      { value: 'International', label: 'International' },
    ],
    value: newAchievement?.level || '',
    onChange: (value: string) => onChange({ ...newAchievement, level: value }),
    placeholder: 'Select Level',
  },
  {
    id: 'levelOfAchievement',
    label: 'Level of Achievement',
    options: [
      { value: '', label: 'Select Achievement Level' },
      { value: 'Participation', label: 'Participation' },
      { value: 'Bronze', label: 'Bronze' },
      { value: 'Silver', label: 'Silver' },
      { value: 'Gold', label: 'Gold' },
      { value: 'Other', label: 'Other' },
    ],
    value: newAchievement?.levelOfAchievement || '',
    onChange: (value: string) => onChange({ ...newAchievement, levelOfAchievement: value }),
    placeholder: 'Select Achievement Level',
  },
  {
    id: 'positionHeld',
    label: 'Position Held',
    options: [
      { value: '', label: 'Select Position' },
      { value: 'Participant', label: 'Participant' },
      { value: 'Team Member', label: 'Team Member' },
      { value: 'Team Leader', label: 'Team Leader' },
      { value: 'President', label: 'President' },
      { value: 'Other', label: 'Other' },
    ],
    value: newAchievement?.positionHeld || '',
    onChange: (value: string) => onChange({ ...newAchievement, positionHeld: value }),
    placeholder: 'Select Position',
  },
];

export const getReferenceFields = (
  reference: ReferenceContact,
  onChange: (r: ReferenceContact) => void
) => {
  const phone = reference?.phone || { country: '', area: '', number: '' };

  return [
    {
      id: 'firstName',
      registerId: 'reference.firstName',
      label: 'First Name',
      type: 'text',
      value: reference?.firstName || '',
      onChange: (value: string) => onChange({ ...reference, firstName: value }),
      placeholder: 'Enter first name',
    },
    {
      id: 'lastName',
      registerId: 'reference.lastName',
      label: 'Last Name',
      type: 'text',
      value: reference?.lastName || '',
      onChange: (value: string) => onChange({ ...reference, lastName: value }),
      placeholder: 'Enter last name',
    },
    {
      id: 'position',
      registerId: 'reference.position',
      label: 'Position / Title',
      type: 'text',
      value: reference?.position || '',
      onChange: (value: string) => onChange({ ...reference, position: value }),
      placeholder: 'Enter position or title',
    },
    {
      id: 'email',
      registerId: 'reference.email',
      label: 'Email',
      type: 'email',
      value: reference?.email || '',
      onChange: (value: string) => onChange({ ...reference, email: value }),
      placeholder: 'Enter email address',
    },
    {
      id: 'phoneCountry',
      registerId: 'reference.phone.country',
      label: 'Country Code',
      type: 'text',
      value: phone.country,
      onChange: (value: string) => onChange({ ...reference, phone: { ...phone, country: value } }),
      placeholder: 'e.g., +65',
    },
    {
      id: 'phoneArea',
      registerId: 'reference.phone.area',
      label: 'Area Code',
      type: 'text',
      value: phone.area,
      onChange: (value: string) => onChange({ ...reference, phone: { ...phone, area: value } }),
      placeholder: 'e.g., 123',
    },
    {
      id: 'phoneNumber',
      registerId: 'reference.phone.number',
      label: 'Phone Number',
      type: 'text',
      value: phone.number,
      onChange: (value: string) => onChange({ ...reference, phone: { ...phone, number: value } }),
      placeholder: 'e.g., 4567890',
    },
  ];
};
