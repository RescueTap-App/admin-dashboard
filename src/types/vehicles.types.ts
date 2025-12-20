export type RegisteredVehicleTableTypes = {
    id:string
    owner: string;
    vehicle: string;
    regNumber: string;
    color: string
    lastActivity: string;
    status: string;
}

export type SlotRequestFormData = {
    organizationId: string;
    subscriptionId: string;
    requestId: string;
    additionalUserSlots:number
    additionalDriverSlots:number
    numberOfSlots: number;
    requesterName: string;
    urgency: string;
    justification: string;
}