/**
 * Role-based permission helpers
 * @param {string} role - User role: "admin" | "coordinator" | "photographer" | "student"
 */

/**
 * Check if user can upload photos
 * Allowed roles: admin, coordinator, photographer
 * @param {string} role - User role
 * @returns {boolean}
 */
export function canUpload(role) {
  return role === "admin" || role === "coordinator" || role === "photographer"
}

/**
 * Check if user can create events
 * Allowed roles: coordinator only
 * @param {string} role - User role
 * @returns {boolean}
 */
export function canCreateEvent(role) {
  return role === "coordinator"
}

/**
 * Check if user can view admin panel
 * Allowed roles: admin only
 * @param {string} role - User role
 * @returns {boolean}
 */
export function canViewAdminPanel(role) {
  return role === "admin"
}

