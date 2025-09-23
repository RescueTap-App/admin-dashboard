import { z } from "zod"

// Zod schemas for form validation
export const visitorsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    purpose: z.string().min(2, "Purpose must be at least 2 characters"),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
    email: z.email("Please enter a valid email address"),
    startTime: z.date(),
    endTime: z.date(),
    vehicleNumber: z.string().min(2, "Vehicle number must be at least 2 characters"),
})

export type VisitorsSchemaFormDataType = z.infer<typeof visitorsSchema>
