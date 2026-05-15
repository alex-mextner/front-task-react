import { describe, expect, it } from 'vitest'

import { HOURS_PER_MONTH, isVisibleByAge } from './peopleFilter'

describe('isVisibleByAge', () => {
  describe('filter inactive (minimumAgeInMonths === null)', () => {
    it('shows person with concrete age', () => {
      expect(isVisibleByAge({ ageInHours: 100 }, null)).toBe(true)
    })
    it('shows person with zero age', () => {
      expect(isVisibleByAge({ ageInHours: 0 }, null)).toBe(true)
    })
    it('shows person with unknown age', () => {
      expect(isVisibleByAge({ ageInHours: null }, null)).toBe(true)
    })
  })

  describe('filter at zero (minimumAgeInMonths === 0)', () => {
    it('shows person with zero age (>= 0)', () => {
      expect(isVisibleByAge({ ageInHours: 0 }, 0)).toBe(true)
    })
    it('shows person with any positive age', () => {
      expect(isVisibleByAge({ ageInHours: 1 }, 0)).toBe(true)
    })
    it('shows person with unknown age', () => {
      expect(isVisibleByAge({ ageInHours: null }, 0)).toBe(true)
    })
  })

  describe('filter at 1 month (= 720 hours)', () => {
    it('shows person exactly at 720 hours (= 30 days)', () => {
      expect(isVisibleByAge({ ageInHours: 720 }, 1)).toBe(true)
    })
    it('shows person 1 hour over threshold', () => {
      expect(isVisibleByAge({ ageInHours: 721 }, 1)).toBe(true)
    })
    it('hides person 1 hour under threshold', () => {
      expect(isVisibleByAge({ ageInHours: 719 }, 1)).toBe(false)
    })
    it('hides person at 672 hours (= 28 days, "almost a month")', () => {
      expect(isVisibleByAge({ ageInHours: 672 }, 1)).toBe(false)
    })
    it('hides person at 674 hours', () => {
      expect(isVisibleByAge({ ageInHours: 674 }, 1)).toBe(false)
    })
    it('hides person at 0', () => {
      expect(isVisibleByAge({ ageInHours: 0 }, 1)).toBe(false)
    })
    it('shows person with unknown age (does not penalize missing data)', () => {
      expect(isVisibleByAge({ ageInHours: null }, 1)).toBe(true)
    })
  })

  describe('filter at 12 months (= 8640 hours, our "year")', () => {
    it('shows person at exactly 8640 hours', () => {
      expect(isVisibleByAge({ ageInHours: 8640 }, 12)).toBe(true)
    })
    it('shows person at 8760 hours (calendar year > 12 × 30d)', () => {
      expect(isVisibleByAge({ ageInHours: 8760 }, 12)).toBe(true)
    })
    it('hides person at 8639 hours', () => {
      expect(isVisibleByAge({ ageInHours: 8639 }, 12)).toBe(false)
    })
  })

  describe('high values', () => {
    it('shows person at 100 mo with exactly 72000 hours', () => {
      expect(isVisibleByAge({ ageInHours: 100 * HOURS_PER_MONTH }, 100)).toBe(true)
    })
    it('handles large numbers without precision loss', () => {
      expect(isVisibleByAge({ ageInHours: 9_999_999 }, 1)).toBe(true)
    })
  })

  describe('boundary semantics', () => {
    it('HOURS_PER_MONTH is 720 (30 days × 24h)', () => {
      expect(HOURS_PER_MONTH).toBe(720)
    })
  })
})
