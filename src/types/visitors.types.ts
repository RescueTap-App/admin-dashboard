export type ActiveVisitorsTableTypes = {
    id: string;
    visitorsName: string
    tagNumber: string
    phone: string;
    purpose: string;
    hostName: string;
    regNumber: string;
    check_in_time: string;
}

export type ActiveVisitorsLogTableTypes = {
    tenantId: {
        _id: string
        firstName: string
        lastName: string
        phoneNumber: string
    },
    _id: string;
    name: string
    vehicleNumber: string
    phone: string;
    purpose: string;
    photoUrl: string;
    entryCode: string;
    status: 'pending' | 'expired' | 'checked_out' | 'checked_in' | 'canceled';
    startTime: string;
    endTime: string;
    createdAt: Date;
    updatedAt: Date;
}

export type VisitorDataTypes = {
    id?: string;
    status?: string;
    phone?: string;
    email?: string;
    name: string;
    vehicleNumber: string;
    purpose: string;
    startTime: string;
    endTime: string;
}