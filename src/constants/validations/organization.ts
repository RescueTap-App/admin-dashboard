import { z } from "zod";

const contactPersonSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  contactEmail: z.email("Invalid email"),
  contactPhone: z.string().min(10, "Phone number too short"),
});

export const createOrganizationSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  noOfUnits: z
    .union([z.string(), z.number()])
    .refine(val => !isNaN(Number(val)), "No. of units must be a number"),
  category: z.string().min(1, "Category is required"),
  address: z.string().min(1, "Address is required"),
  contactPerson: z.array(contactPersonSchema).min(1, "At least one contact person is required"),
});

export type createOrganizationSchemaType = z.infer<typeof createOrganizationSchema>;
