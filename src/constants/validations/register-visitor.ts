import { z } from "zod"

// Zod schemas for form validation
export const visitorsSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    purposeOfVisit: z.string().min(2, "Purpose of visit must be at least 2 characters"),
    phoneNumber: z
        .string()
        .regex(/^0\d{10}$/, "Phone number must start with 0 and be exactly 11 digits"),
    residentialAddress: z.string().min(10, "Please enter a complete address"),
    hostName: z.string().min(2, "Host Name must be at least 2 characters"),
    hostPhone: z.string().min(2, "Host Phone must be at least 2 characters"),
    date: z.date("Date is required."),
    time: z.string().min(3, "Please enter a valid time"),
    vehiclePlateNumber: z.string().optional(),
    notes: z.string().optional()
})

export type VisitorsSchemaFormDataType = z.infer<typeof visitorsSchema>
