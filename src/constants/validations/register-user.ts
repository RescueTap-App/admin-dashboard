// schemas/user.schema.ts
import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z
        .string()
        .min(10, "Phone number is too short")
        .max(14, "Phone number is too long")
        .regex(/^234\d{10}$/, "Phone number must be in Nigerian format (e.g., 2348012345678)"),
    address: z.string().min(1, "Address is required"),
    verified: z.boolean(),
});
export type CreateUserFormData = z.infer<typeof userSchema>;
