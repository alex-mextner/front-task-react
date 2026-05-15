import type { ComponentPropsWithoutRef } from 'react'

/**
 * Form field label styled per the Figma design system
 * (Koulen 400 / 16px / line-height 15px / letter-spacing 0.02em).
 *
 * Accepts all native `<label>` props; extra `className` is appended for
 * call-site state styling (e.g. `group-focus-within:text-...`).
 */
export default function FieldLabel({ className, ...rest }: ComponentPropsWithoutRef<'label'>) {
  return (
    <label
      {...rest}
      className={`block font-display text-base leading-[15px] tracking-[0.02em] text-[var(--color-text-primary)] ${className ?? ''}`}
    />
  )
}
