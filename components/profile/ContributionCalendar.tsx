"use client";

import { useMemo } from "react";
import { toLocalDateKey } from "@/lib/date-key";
import type { ContributionDay } from "@/types/leaderboard";

/**
 * One hue (accent), four steps light->dark via color-mix toward the surface
 * token — flips anchor automatically in dark mode because --color-accent and
 * --color-surface already do, no separate light/dark ramp needed. Direct
 * integer buckets (0/1/2/3/4+) rather than quartiles: daily test counts are
 * small, so quartiles would just recreate the same four buckets with extra
 * steps.
 */
const LEVEL_BG = [
  "var(--color-surface)",
  "color-mix(in srgb, var(--color-accent) 25%, var(--color-surface))",
  "color-mix(in srgb, var(--color-accent) 50%, var(--color-surface))",
  "color-mix(in srgb, var(--color-accent) 75%, var(--color-surface))",
  "var(--color-accent)",
] as const;

function levelFor(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

const MONTH_LABELS_TR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

/** Parses a `YYYY-MM-DD` key without going through `Date`'s UTC-based
 * string parsing, which would reintroduce the same timezone-shift bug the
 * grid itself had to avoid. */
function monthOf(dateKey: string): number {
  return Number(dateKey.slice(5, 7)) - 1;
}

interface Cell {
  date: string;
  count: number;
  inRange: boolean;
}

interface ContributionCalendarProps {
  days: ContributionDay[];
  year: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
}

export function ContributionCalendar({ days, year, availableYears, onYearChange }: ContributionCalendarProps) {
  const countByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of days) map.set(d.date, d.count);
    return map;
  }, [days]);

  const weeks = useMemo(() => {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Don't light up (or count) days that haven't happened yet for the
    // current year's tab.
    const visibleEnd = yearEnd < today ? yearEnd : today;

    const alignedStart = new Date(yearStart);
    alignedStart.setDate(alignedStart.getDate() - alignedStart.getDay());
    const alignedEnd = new Date(yearEnd);
    alignedEnd.setDate(alignedEnd.getDate() + (6 - alignedEnd.getDay()));

    const cells: Cell[] = [];
    const cursor = new Date(alignedStart);
    while (cursor <= alignedEnd) {
      const date = toLocalDateKey(cursor);
      const inRange = cursor >= yearStart && cursor <= visibleEnd;
      cells.push({ date, count: countByDate.get(date) ?? 0, inRange });
      cursor.setDate(cursor.getDate() + 1);
    }

    const result: Cell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [countByDate, year]);

  const monthLabels = useMemo(
    () =>
      weeks.map((week, i) => {
        const month = monthOf(week[0].date);
        const prevMonth = i > 0 ? monthOf(weeks[i - 1][0].date) : null;
        return month !== prevMonth ? MONTH_LABELS_TR[month] : null;
      }),
    [weeks]
  );

  const totalCount = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">{year} yılında {totalCount} test tamamlandı</p>
        <div className="flex items-center gap-3 text-[0.6875rem] text-ink-muted">
          <div className="flex items-center gap-1">
            {availableYears.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => onYearChange(y)}
                className={`rounded-full px-2.5 py-1 font-mono tabular-figures transition-colors ${
                  y === year
                    ? "bg-accent/15 font-semibold text-accent dark:bg-accent/20 dark:text-accent-strong"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span>Az</span>
            {LEVEL_BG.map((bg, i) => (
              <span
                key={i}
                className="h-2.5 w-2.5 rounded-sm border border-hairline/60"
                style={{ background: bg }}
              />
            ))}
            <span>Çok</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          <div className="flex gap-1">
            {monthLabels.map((label, wi) => (
              <div key={wi} className="relative h-3.5 w-2.5">
                {label && (
                  <span className="absolute left-0 top-0 whitespace-nowrap text-[10px] text-ink-muted">
                    {label}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="inline-flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    role="img"
                    aria-label={`${day.date}: ${day.count} test`}
                    title={`${day.date}: ${day.count} test`}
                    tabIndex={day.inRange ? 0 : -1}
                    className="h-2.5 w-2.5 rounded-sm border border-hairline/60 outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    style={{
                      background: day.inRange ? LEVEL_BG[levelFor(day.count)] : "transparent",
                      opacity: day.inRange ? 1 : 0,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
