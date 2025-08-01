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
     password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

export type CreateDriverFormData = z.infer<typeof createDriverSchema>;
