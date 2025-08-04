export interface Driver {
  _id: string;
  driverName: string;
  status: string;
  vehicle: string;
  image: string;
  driverId: string;
  licenseNumber: string;
  emailAddress: string;
  emergencyContactName: string;
  homeAddress: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleType: string;
  insuranceInformation: string;
  password: string;
  profileImage: string;
  numberOfTrips: number;
  termsAndConditionsAgreement: boolean;
  privacyConsent: boolean;
  registrationDate: Date; 
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface DriverApplication {
  _id: string;
  userId: string;
  driverId: Driver;
  isConfirmed: boolean;
  rejectionReason: string;
  createdAt: Date; 
  updatedAt: Date;

}
