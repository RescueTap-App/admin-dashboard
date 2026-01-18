export type UserListType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImage: string;
  role: "user" | "admin" | "driver";
  verified: boolean;
  totalRides: number;
  hasActiveSubscription: boolean;
  userType: "individual" | "family" | "organization";
  createdAt: Date;
  updatedAt: Date;
};
