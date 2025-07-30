import { z } from 'zod';

export const createDriverSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z
        .string()
        .min(10, "Phone number is too short")
        .max(14, "Phone number is too long")
        .regex(/^234\d{10}$/, "Phone number must be in Nigerian format (e.g., 2348012345678)"),
    address: z.string().min(1, "Address is required"),
    driverType: z.enum(["residential", "commercial"]),
    plateNumber: z.string().min(1, "Plate number is required"),
    vehicleName: z.string().min(1, "Vehicle name is required"),
    regNumber: z.string().min(1, "Registration number is required"),
    vehicleModel: z.string().min(1, "Vehicle model is required"),
    profileImage: z.string().nonempty("Profile image is required"),
    vehicleImage: z.string().nonempty("Vehicle image is required"),
});

export type CreateDriverFormData = z.infer<typeof createDriverSchema>;
