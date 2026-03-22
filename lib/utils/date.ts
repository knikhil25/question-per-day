/**
 * Returns a Date object set to UTC midnight for the current date in PST.
 * Useful for finding "Today's Challenge" consistently based on PST.
 */
export function getPSTDate(date: Date = new Date()) {
    const dateString = date.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    return new Date(dateString + 'T00:00:00Z');
}

/**
 * Normalizes any Date object to UTC midnight without shifting based on timezone.
 * Useful for dates coming from pickers that are already "Calendar Dates".
 */
export function normalizeDate(date: Date) {
    const d = new Date(date);
    // If it's already UTC midnight, return as is
    if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) return d;

    // Otherwise, use the date identity from LA to normalize
    const dateString = d.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    return new Date(dateString + 'T00:00:00Z');
}

/**
 * Consistently format a date as a string in PST for the UI.
 */
export function formatPST(date: Date | string) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        timeZone: 'UTC', // We store as UTC Midnight, so we read as UTC to preserve the "Identity"
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
