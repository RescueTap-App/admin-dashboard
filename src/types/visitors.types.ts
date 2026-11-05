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
    /** One entry per check-in; the backend appends to this on every scan. */
    history?: CheckInHistoryEntry[];
    /** Reusable pass / personal QR: one record shared across many visits. */
    isPersistent?: boolean;
    noOfVisitors: number;
    status: VisitorStatus;
    startTime: string;
    endTime: string;
    /** Latest check-in only — overwritten on every scan. Use `history` for past visits. */
    checkedInAt: string;
    checkedOutAt?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type VisitorStatus = 'pending' | 'expired' | 'checked_out' | 'checked_in' | 'canceled'

export type CheckInHistoryEntry = {
    checkedInAt: string;
    checkedOutAt?: string;
    durationMinutes?: number;
}

/**
 * One row in the visitors log = one visit. A record with several entries in
 * `history` becomes several rows; `checkedInAt`/`checkedOutAt`/`status` are
 * that visit's values, and `_id` is unique per visit.
 */
export type VisitorLogRow = ActiveVisitorsLogTableTypes & {
    /** The underlying visitor record's id (use for API calls). */
    recordId: string;
    /** 0-based position in the record's visit history; null if no history. */
    visitIndex: number | null;
    visitCount: number;
    /** Only the latest visit reflects the record's live state, so only it gets actions. */
    isLatestVisit: boolean;
}


export type VisitorsLogResponse = {
    visitors: ActiveVisitorsLogTableTypes[]
    stats: {
        activeVisitors: number,
        pendingArrivals: number,
        todaysVisits: number,
        totalVisits: number
    },
    pagination: {
        total: number,
        page: number,
        limit: number,
        totalPages: number
    },
}
export type VisitorDataTypes = {
    id?: string;
    status?: string;
    phone?: string;
    email?: string;
    name: string;
    vehicleNumber?: string;
    purpose: string;
    startTime: string;
    endTime: string;
}