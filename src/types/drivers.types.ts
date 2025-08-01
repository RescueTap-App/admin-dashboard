export type DriverRegistrationData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    driverType: 'residential' | 'commercial';
    plateNumber: string;
    vehicleName: string;
    regNumber: string;
    vehicleModel: string;
    profileImage: string;
    vehicleImage: string;
    password: string;
};

export type DriverListTypes = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    driverType: 'residential' | 'commercial';
    status: string
    plateNumber: string;
    vehicleName: string;
    termsAndConditionsAgreement: boolean;
    regNumber: string;
    vehicleModel: string;
    profileImage: string;
    vehicleImage: string;
    registrationDate: Date;
    createdAt: Date
}
