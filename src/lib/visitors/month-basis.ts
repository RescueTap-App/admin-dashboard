/**
 * Fallback date used by the visitors-log date filter for rows that were never
 * checked in (pending, canceled, expired). Rows with a check-in are always
 * filtered by that visit's check-in time.
 */
export enum VisitorMonthBasis {
        CheckedInAt = "checkedInAt",
        CreatedAt = "createdAt",
        StartTime = "startTime",
}

/** Default: creation time, so newly created (still pending) passes show up immediately. */
export const VISITOR_MONTH_BASIS: VisitorMonthBasis =
        VisitorMonthBasis.CreatedAt
