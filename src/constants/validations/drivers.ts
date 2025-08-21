import { z } from 'zod';

export const createDriverSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z
        .string()
        .regex(/^0\d{10}$/, "Phone number must start with 0 and be exactly 11 digits"),
    address: z.string().min(1, "Address is required"),
    driverType: z.enum(["residential", "commercial"]),
    plateNumber: z.string().min(1, "Plate number is required"),
    vehicleName: z.string().min(1, "Vehicle name is required"),
    regNumber: z.string().min(1, "Registration number is required"),
    vehicleModel: z.string().min(1, "Vehicle model is required"),
    profileImage: z.string().nonempty("Profile image is required"),
    vehicleImage: z.string().nonempty("Vehicle image is required"),
    // password: z.string()
    //     .min(8, "Password must be at least 8 characters")
    //     .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    //     .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //     .regex(/[0-9]/, "Password must contain at least one number")
    //     .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});


export const updateDriverSchema = z.object({
    driverName: z.string().optional(),
    status: z.enum(["Active", "Blacklist"]).optional(),
    vehicle: z.string().optional(),
    image: z.string().url().optional(),
    driverId: z.string().optional(),
    licenseNumber: z.string().optional(),
    emailAddress: z.email("Invalid email address").optional(),
    emergencyContactName: z.string().optional(),
    homeAddress: z.string().optional(),
    vehicleMake: z.string().optional(),
    vehicleModel: z.string().optional(),
    vehicleType: z.string().optional(),
    insuranceInformation: z.string().optional(),
    // password: z
    //     .string()
    //     .min(8, "Password must be at least 8 characters")
    //     .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    //     .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //     .regex(/[0-9]/, "Password must contain at least one number")
    //     .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    //     .optional(),
    profilePicture: z.string().url("Invalid URL").optional(),
    numberOfTrips: z.number().optional(),
    termsAndConditionsAgreement: z.boolean().optional(),
    privacyConsent: z.boolean().optional(),
});


export type CreateDriverFormData = z.infer<typeof createDriverSchema>;
export type UpdateDriverFormData = z.infer<typeof updateDriverSchema>;
