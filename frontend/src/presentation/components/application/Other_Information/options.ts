export const radioOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];


  // for HealthConditionForm,tsx
 export const fields = [
    {
      id: 'condition',
      label: 'Condition',
      type: 'text',
      multiline: false,
      required: true,
    },
    {
      id: 'details',
      label: 'Details',
      type: 'text',
      multiline: true,
      required: true,
      rows: 4,
    },
  ];
