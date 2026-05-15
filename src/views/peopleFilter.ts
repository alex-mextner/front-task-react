import type { Person } from '@/store'

/** Calendar-month approximation: 30 days × 24h. Picked over the year-based
 *  average (8760/12 ≈ 730) because users think of "1 month" as 30 days. */
export const HOURS_PER_MONTH = 24 * 30

/**
 * Should this person be visible given the minimum-age filter?
 *
 * - `minimumAgeInMonths === null` → filter inactive, everyone is shown.
 * - `person.ageInHours === null` → no age recorded; show (don't penalize missing data).
 * - otherwise: `ageInHours >= minimumAgeInMonths * HOURS_PER_MONTH`.
 */
export function isVisibleByAge(
  person: Pick<Person, 'ageInHours'>,
  minimumAgeInMonths: number | null
): boolean {
  if (minimumAgeInMonths === null) return true
  if (person.ageInHours === null) return true
  return person.ageInHours >= minimumAgeInMonths * HOURS_PER_MONTH
}
