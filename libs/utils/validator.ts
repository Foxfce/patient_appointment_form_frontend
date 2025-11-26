import { z } from 'zod';
import { CountryCode, Languages } from '../nationality';

const thaiMobileRegex = /^0[0-9]{9}$/;

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;

const languagesOptions = Object.entries(Languages).map(([value, label]) => ({
  value: value as keyof typeof Languages,
  label: label,
}));

const countryOptions = Object.entries(CountryCode).map(([value, name]) => ({
  value: value as keyof typeof CountryCode,
  name: name,
}));

// Define the schema for the Emergency Contact (optional object)
const EmergencyContactSchema = z.object({
  name: z.string().optional().nullable(),
  relationship: z.string().optional().nullable(),
}).optional();

const PatientFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First Name is required and must be at least 2 characters."
    }),

  // Optional
  middleName: z
    .string()
    .optional()
    .nullable(),
  lastName: z
    .string()
    .min(2, {
      message: "Last Name is required and must be at least 2 characters."
    }),
  dateOfBirth: z
    .date({
      error: "Birth date is required.",    
    })
    .max(new Date(), {message: 'Birth date cannot be in the future.'}),
  gender: z
    .enum(GENDERS),
  phoneNumber: z
    .string()
    .regex(thaiMobileRegex, {
      message: "Phone Number is required and must be a valid format"
    }),
  email: z
    .email({
      message: "Email is required and must be a valid email address."
    }),
  address: z
    .string()
    .min(1, {
      message: "Address is required"
    }),
  preferredLanguage: z
    .enum(Object.keys(Languages) as [keyof typeof Languages, ...string[]]),
  nationality: z
    .enum(Object.keys(CountryCode) as [keyof typeof CountryCode, ...string[]]),

  // Optional Fields
  emergencyContact: EmergencyContactSchema,
  religion: z
    .string()
    .optional()
    .nullable(),
});

// Export the schema and the inferred type
export type PatientFormInput = z.infer<typeof PatientFormSchema>;

export { PatientFormSchema, GENDERS, countryOptions, languagesOptions };