/**
 * Utility functions for clean date & time formatting across DVS Realty app.
 */

/**
 * Formats a date string (ISO timestamp or YYYY-MM-DD) into a clean, human-readable date.
 * Example: "2026-08-15T00:00:00.000000Z" -> "15 Aug 2026"
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'TBD';

  try {
    let dateStr = String(dateInput).trim();
    
    // Extract YYYY-MM-DD if ISO format with timestamp
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }

    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed
      const day = parseInt(parts[2], 10);

      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const dateObj = new Date(year, month, day);
        return dateObj.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
    }

    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    return String(dateInput);
  } catch (e) {
    return String(dateInput);
  }
}

/**
 * Formats a date with a time slot string.
 * Example: formatDateWithSlot("2026-08-15T00:00:00.000000Z", "11:00 AM") -> "15 Aug 2026 at 11:00 AM"
 */
export function formatDateWithSlot(
  dateInput: string | Date | null | undefined,
  timeSlot?: string | null
): string {
  const formattedDate = formatDate(dateInput);
  if (!timeSlot) return formattedDate;
  return `${formattedDate} at ${timeSlot}`;
}
