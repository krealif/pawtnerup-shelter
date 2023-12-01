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
