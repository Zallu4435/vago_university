// src/constants/achievementModal/fields.ts

import {
    activityOptions,
    positionOptions,
    levelOptions,
    levelOfAchievementOptions,
  } from './options';
  import { Achievement, ReferenceContact } from './types'; // Create types file or import from component
  
  export const getSelectFields = (
    newAchievement: Achievement,
    setNewAchievement: (a: Achievement) => void
  ) => [
    {
      id: 'activity',
      label: 'Activity',
      options: activityOptions,
      value: newAchievement.activity,
      onChange: (val: string) => setNewAchievement({ ...newAchievement, activity: val }),
      placeholder: 'Select activity',
    },
    {
      id: 'positionHeld',
      label: 'Position Held',
      options: positionOptions,
      value: newAchievement.positionHeld,
      onChange: (val: string) => setNewAchievement({ ...newAchievement, positionHeld: val }),
      placeholder: 'Select position',
    },
    {
      id: 'level',
      label: 'Level',
      options: levelOptions,
      value: newAchievement.level,
      onChange: (val: string) => setNewAchievement({ ...newAchievement, level: val }),
      placeholder: 'Select level',
    },
    {
      id: 'levelOfAchievement',
      label: 'Level of Achievement',
      options: levelOfAchievementOptions,
      value: newAchievement.levelOfAchievement,
      onChange: (val: string) => setNewAchievement({ ...newAchievement, levelOfAchievement: val }),
      placeholder: 'Select level of achievement',
    },
  ];
  
  export const getReferenceFields = (
    referenceContact: ReferenceContact,
    setReferenceContact: (r: ReferenceContact) => void
  ) => [
    {
      id: 'refFirstName',
      label: 'First Name',
      value: referenceContact.firstName,
      onChange: (val: string) => setReferenceContact({ ...referenceContact, firstName: val }),
      placeholder: 'Enter first name',
    },
    {
      id: 'refLastName',
      label: 'Last Name',
      value: referenceContact.lastName,
      onChange: (val: string) => setReferenceContact({ ...referenceContact, lastName: val }),
      placeholder: 'Enter last name',
    },
    {
      id: 'refPosition',
      label: 'Position of Contact Person',
      value: referenceContact.position,
      onChange: (val: string) => setReferenceContact({ ...referenceContact, position: val }),
      placeholder: 'Enter position',
    },
    {
      id: 'refEmail',
      label: 'Email Address',
      type: 'email',
      value: referenceContact.email,
      onChange: (val: string) => setReferenceContact({ ...referenceContact, email: val }),
      placeholder: 'Enter email address',
    },
    {
      id: 'refPhoneCountry',
      label: 'Telephone Country',
      value: referenceContact.phone.country,
      onChange: (val: string) =>
        setReferenceContact({ ...referenceContact, phone: { ...referenceContact.phone, country: val } }),
      placeholder: 'Country code (e.g. +65)',
    },
    {
      id: 'refPhoneArea',
      label: 'Telephone Area',
      value: referenceContact.phone.area,
      onChange: (val: string) =>
        setReferenceContact({ ...referenceContact, phone: { ...referenceContact.phone, area: val } }),
      placeholder: 'Area code',
    },
    {
      id: 'refPhoneNumber',
      label: 'Telephone Number',
      value: referenceContact.phone.number,
      onChange: (val: string) =>
        setReferenceContact({ ...referenceContact, phone: { ...referenceContact.phone, number: val } }),
      placeholder: 'Phone number',
    },
  ];
