/**
 * Format ISO date string to readable format
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

/**
 * Get status badge class name
 * @param {string} status
 * @returns {string}
 */
export const getStatusClass = (status) => {
  const map = {
    ACTIVE: 'badge-active',
    PENDING: 'badge-pending',
    RESOLVED: 'badge-resolved',
    DISMISSED: 'badge-dismissed',
  }
  return map[status] || 'badge-pending'
}

/**
 * Get priority badge class name
 * @param {string} priority
 * @returns {string}
 */
export const getPriorityClass = (priority) => {
  const map = {
    CRITICAL: 'badge-critical',
    HIGH: 'badge-high',
    MEDIUM: 'badge-medium',
    LOW: 'badge-low',
  }
  return map[priority] || 'badge-medium'
}

/**
 * Truncate a string to a given length
 * @param {string} str
 * @param {number} len
 * @returns {string}
 */
export const truncate = (str, len = 100) => {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}
