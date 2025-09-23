import { z } from "zod"

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})


export const forgotPasswordSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});


export const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const authCodeSchema = z.object({
  otp: z.string()
    .length(5, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export type ResetPasswordDataType = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordDataType = z.infer<typeof forgotPasswordSchema>;
export type SignInFormDataType = z.infer<typeof signInSchema>;
export type AuthCodeFormDataType = z.infer<typeof authCodeSchema>;
