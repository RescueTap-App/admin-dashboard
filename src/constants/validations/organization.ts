import { z } from "zod";

export const createOrganizationSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  subscriptionPlan: z
    .enum(["monthly", "yearly"])
    .refine(val => val === "monthly" || val === "yearly", {
      message: "Subscription plan must be 'monthly' or 'yearly'",
    }),
  driverLimit: z
    .union([z.string(), z.number()])
    .refine(val => !isNaN(Number(val)), "Driver limit must be a number"),
  userLimit: z
    .union([z.string(), z.number()])
    .refine(val => !isNaN(Number(val)), "User limit must be a number"),
  amount: z
    .union([z.string(), z.number()])
    .refine(val => !isNaN(Number(val)), "Amount must be a number"),
});

export const inviteOrgSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number is too short")
    .max(14, "Phone number is too long")
    .regex(/^234\d{10}$/, "Phone number must be in Nigerian format (e.g., 2348012345678)"),
});

export type InviteOrgSchamaFormData = z.infer<typeof inviteOrgSchema>;
export type createOrganizationSchemaType = z.infer<typeof createOrganizationSchema>;
