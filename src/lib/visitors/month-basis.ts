/**
 * Which visitor date field defines the activity-log month.
 * Swap `VISITOR_MONTH_BASIS` to change behavior app-wide.
 */
export enum VisitorMonthBasis {
  CheckedInAt = "checkedInAt",
  CreatedAt = "createdAt",
  StartTime = "startTime",
}

/** Default: check-in time (activity log semantics). */
export const VISITOR_MONTH_BASIS: VisitorMonthBasis =
  VisitorMonthBasis.CheckedInAt
