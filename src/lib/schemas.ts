import * as z from 'zod';
import customErrorMap from './zod-error-map';

z.setErrorMap(customErrorMap);

export const shelterSchema = z.object({
  name: z.string().min(3).max(32),
  address: z.string().min(3).max(255),
  contactEmail: z.string().email(),
  phoneNumber: z
    .string()
    .regex(/^(?:\+62)[2-9]\d{7,11}$/, 'Must be a valid phone number'),
});

export type Shelter = z.infer<typeof shelterSchema>;

const sterilizationStatus = [
  'VACCINATED',
  'NOT_STERILIZED',
  'NEUTERED',
  'SPAYED',
] as const;

export const dogSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3).max(128),
  gender: z.enum(['MALE', 'FEMALE']),
  breed: z.string().min(3).max(128),
  estimateAge: z.number().min(1).max(99),
  sterilizationStatus: z.enum(sterilizationStatus),
  rescueStory: z.string().min(3).max(2000),
  media: z.any().refine((files: File[]) => files.length > 0, 'Photos required'),
});

export type Dog = z.infer<typeof dogSchema>;
