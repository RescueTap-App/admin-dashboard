/**
 * Super-admins (`role === "admin"`) may sign in.
 * Organization dashboards require both `role === "organization"` and
 * `userType === "organization"`. Individual and family accounts are rejected
 * even when their role is `organization`.
 */
export function canAccessAdminApp(
  role?: string | null,
  userType?: string | null,
): boolean {
  if (role === "admin") return true
  if (role !== "organization") return false
  return userType === "organization"
}

export function homePathForRole(role?: string | null): string | null {
  if (role === "admin") return "/dashboard/organizations"
  if (role === "organization") return "/org"
  return null
}

/** Whether `pathname` is allowed for this JWT role. */
export function isPathAllowedForRole(
  role: string | null | undefined,
  pathname: string,
): boolean {
  if (role === "admin") return pathname.startsWith("/dashboard")
  if (role === "organization") return pathname.startsWith("/org")
  return false
}

/**
 * Allow only same-origin relative redirects that the role may open.
 * Rejects protocol-relative URLs (`//evil.com`).
 */
export function isSafeRedirectForRole(
  role: string | null | undefined,
  redirect: string | null | undefined,
): boolean {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return false
  }
  return isPathAllowedForRole(role, redirect)
}

export const NO_ADMIN_ACCESS_MESSAGE =
  "Admin access is for organization admins and system administrators only. Please use the RescueTap mobile app."
