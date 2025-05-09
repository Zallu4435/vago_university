const salutationOptions = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "ms", label: "Ms." },
  { value: "dr", label: "Dr." },
];

const citizenshipOptions = [
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "in", label: "India" },
  { value: "cn", label: "China" },
  { value: "us", label: "United States" },
];

const residentialStatusOptions = [
  { value: "citizen", label: "Citizen" },
  { value: "pr", label: "Permanent Resident" },
  { value: "foreigner", label: "Foreigner" },
];

const raceOptions = [
  { value: "chinese", label: "Chinese" },
  { value: "malay", label: "Malay" },
  { value: "indian", label: "Indian" },
  { value: "others", label: "Others" },
];

const religionOptions = [
  { value: "buddhism", label: "Buddhism" },
  { value: "christianity", label: "Christianity" },
  { value: "islam", label: "Islam" },
  { value: "hinduism", label: "Hinduism" },
  { value: "others", label: "Others" },
  { value: "none", label: "None" },
];

const maritalStatusOptions = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

const countryOptions = [
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "in", label: "India" },
  { value: "cn", label: "China" },
  { value: "us", label: "United States" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const mainFields = [
  {
    id: "salutation",
    label: "Salutation",
    type: "select",
    options: salutationOptions,
    required: true,
  },
  {
    id: "citizenship",
    label: "Citizenship",
    type: "select",
    options: citizenshipOptions,
    required: true,
  },
  { id: "fullName", label: "Full Name", type: "input", required: true },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    options: genderOptions,
    required: true,
  },
  {
    id: "residentialStatus",
    label: "Residential Status",
    type: "select",
    options: residentialStatusOptions,
    required: true,
  },
  { id: "familyName", label: "Family Name / Surname", type: "input" },
  {
    id: "race",
    label: "Race / Ethnic Group",
    type: "select",
    options: raceOptions,
    required: true,
  },
  { id: "givenName", label: "Given Name", type: "input" },
  {
    id: "religion",
    label: "Religion",
    type: "select",
    options: religionOptions,
    required: true,
  },
  {
    id: "dateOfBirth",
    label: "Date of Birth",
    type: "input",
    required: true,
    placeholder: "YYYY-MM-DD",
  },
  {
    id: "maritalStatus",
    label: "Marital Status",
    type: "select",
    options: maritalStatusOptions,
    required: true,
  },
  { id: "postalCode", label: "Postal Code", type: "input", required: true },
  { id: "passportNumber", label: "Passport Number", type: "input" },
  {
    id: "blockNumber",
    label: "Block / House Number",
    type: "input",
    required: true,
  },
  {
    id: "emailAddress",
    label: "Email Address",
    type: "input",
    inputType: "email",
    required: true,
  },
  { id: "streetName", label: "Street Name", type: "input", required: true },
  {
    id: "alternativeEmail",
    label: "Alternative Email",
    type: "input",
    inputType: "email",
  },
  { id: "buildingName", label: "Building Name", type: "input" },
  { id: "floorNumber", label: "Floor Number", type: "input" },
  { id: "unitNumber", label: "Unit Number", type: "input" },
  { id: "stateCity", label: "State / City", type: "input" },
  {
    id: "country",
    label: "Country",
    type: "select",
    options: countryOptions,
    required: true,
  },
];




// for alternative contact
const relationshipOptions = [
  { value: 'parent', label: 'Parent' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'relative', label: 'Relative' },
  { value: 'friend', label: 'Friend' },
];

export const altContactFields = [
  { id: 'alternateContactName', label: 'Name of Next of Kin / Guardian', type: 'input' },
  { id: 'relationshipWithApplicant', label: 'Relationship with Applicant', type: 'select', options: relationshipOptions },
  { id: 'occupation', label: 'Occupation', type: 'input' },
];