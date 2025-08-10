// schemas/user.schema.ts
import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z
        .string()
        .regex(/^0\d{10}$/, "Phone number must start with 0 and be exactly 11 digits"),
    address: z.string().min(1, "Address is required"),
    verified: z.boolean(),
});
export type CreateUserFormData = z.infer<typeof userSchema>;
