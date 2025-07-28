export const JOB_FIELDS = [
  'Technology',
  'Healthcare', 
  'Finance',
  'Education',
  'Marketing',
  'Sales',
  'Engineering',
  'Design',
  'Operations',
  'Human Resources'
] as const;

export const JOB_FIELD_OPTIONS = JOB_FIELDS.map((field, index) => ({
  value: index.toString(),
  label: field
}));

export type JobField = typeof JOB_FIELDS[number];
