// schemas/user.schema.ts
import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^\d+$/, "Phone number must contain only digits")
        .min(7, "Phone number must be at least 7 digits")
        .max(12, "Phone number must not exceed 12 digits")
        .refine((value) => !value.startsWith('0'), {
            message: "Phone number should not start with 0"
        }),
    address: z.string().min(1, "Address is required"),
    verified: z.boolean(),
});
export type CreateUserFormData = z.infer<typeof userSchema>;
