/**
 * Which visitor date field defines the activity-log month.
 * Swap `VISITOR_MONTH_BASIS` to change behavior app-wide.
 */
export enum VisitorMonthBasis {
        CheckedInAt = "checkedInAt",
        CreatedAt = "createdAt",
        StartTime = "startTime",
}

/** Default: creation time, so newly created (still pending) passes show up immediately. */
export const VISITOR_MONTH_BASIS: VisitorMonthBasis =
        VisitorMonthBasis.CreatedAt
