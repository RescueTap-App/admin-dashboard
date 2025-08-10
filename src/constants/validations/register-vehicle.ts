import { z } from "zod"

// Zod schemas for form validation
export const vehicleRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .regex(/^0\d{10}$/, "Phone number must start with 0 and be exactly 11 digits"),
  residentialAddress: z.string().min(10, "Please enter a complete address"),
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  year: z.string().min(4, "Please enter a valid year").max(4, "Please enter a valid year"),
  registrationNumber: z.string().min(3, "Please enter a valid registration number"),
  color: z.string().min(3, "Please enter a valid color"),
  emailAddress: z.email("Please enter a valid email address"),
})

export const slotRequestSchema = z.object({
  numberOfSlots: z
    .number()
    .min(1, "Number of slots must be at least 1")
    .max(100, "Maximum 100 slots per request"),
  requesterName: z
    .string()
    .min(2, "Requester name must be at least 2 characters"),
  urgency: z
    .enum(["low", "medium", "high", "urgent"])
    .refine((val) => !!val, { message: "Please select an urgency level" }),
  justification: z
    .string()
    .min(20, "Please provide a detailed justification (minimum 20 characters)"),
});

export type VehicleRegistrationFormData = z.infer<typeof vehicleRegistrationSchema>
export type SlotRequestFormData = z.infer<typeof slotRequestSchema>
