/**
 * Local calendar-day key (YYYY-MM-DD) for a Date. Deliberately NOT
 * `date.toISOString().slice(0, 10)` — that converts to UTC first, which
 * shifts the date by the viewer's UTC offset (e.g. late-evening activity in
 * UTC+3 lands on "tomorrow" in UTC) and silently drops it into a grid cell
 * that isn't rendered as today.
 */
export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
