
export type OrganizationTableType = {
  id: string;
  organization: string;
  category: string;
  slotsTaken: number;
  slotsAlloted: number
  status: string;
  adminEmail: string;
  dateCreated: Date;
  dueDate: Date
}

export type RevenueTypes = {
  id: string;
  organization: string;
  period: string;
  amount: number;
  status: "paid" | "pending"
  billingDate: Date
}

export type VehicleRegistryTypes = {
  id: string;
  organization: string;
  driverInfo: string
  vehicleModel: string
  regNumber: string;
  type: string;
  status: "Active" | "Expired"
}

export interface Activity {
  id: string
  type: "registration" | "bulk_registration" | "vehicle_add"
  description: string
  timestamp: string
  status: "completed" | "pending"
  category: string
}

export interface Organization {
  id: string
  name: string
  type: "Residential" | "Commercial"
  vehicleSlots: {
    used: number
    total: number
  }
  activeVisitors: number
  qrStickers: number
  vehiclePasses: number
}


export type OrganizationRegistrationData = {
  organizationName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  subscriptionPlan: 'monthly' | 'yearly';
  driverLimit: string | number
  userLimit: string | number
  amount: string | number
};

export type OrgUserInviteData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};
