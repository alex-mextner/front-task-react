import type { ComponentPropsWithoutRef, CSSProperties, Ref } from 'react'
import { NumericFormat } from 'react-number-format'

export type NumericInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode'
> & {
  /** Current numeric value. `null` represents an empty field (shows placeholder). */
  value: number | null
  /** Called with the new value: `null` when the field is empty, otherwise a number. */
  onChange: (value: number | null) => void
  /** Maximum number of digits the user can enter. Default 12. */
  maxDigits?: number
  /** Allow fractional part (`.`/`,`). Default false. */
  allowDecimal?: boolean
  /** Allow negative numbers (leading `-`). Default false. */
  allowNegative?: boolean
  /** Optional minimum width in pixels. Without it the input shrinks to content. */
  minWidthPx?: number
  /** Optional maximum width in pixels. Without it the input grows unbounded. */
  maxWidthPx?: number
  /** Forwarded to the underlying `<input>`. */
  ref?: Ref<HTMLInputElement>
}

/**
 * Numeric input with thousands-space grouping (`1442 -> 1 442`) and adaptive width.
 *
 * @example
 * ```tsx
 * <NumericInput value={hours} onChange={setHours} minWidthPx={72} />
 * ```
 */
export default function NumericInput({
  value,
  onChange,
  maxDigits = 12,
  allowDecimal = false,
  allowNegative = false,
  minWidthPx,
  maxWidthPx,
  className,
  style,
  ref,
  ...rest
}: NumericInputProps) {
  const widthStyle: CSSProperties = {
    ...(minWidthPx !== undefined && { minWidth: `${minWidthPx}px` }),
    ...(maxWidthPx !== undefined && { maxWidth: `${maxWidthPx}px` }),
  }

  return (
    <NumericFormat
      {...rest}
      getInputRef={ref}
      value={value === null ? '' : value}
      onValueChange={({ floatValue }) =>
        onChange(floatValue === undefined ? null : floatValue)
      }
      thousandSeparator=" "
      decimalScale={allowDecimal ? undefined : 0}
      allowNegative={allowNegative}
      isAllowed={({ value: rawString }) =>
        rawString.replace(/\D/g, '').length <= maxDigits
      }
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      style={{ ...widthStyle, ...style }}
      className={`h-11 rounded-md border border-[var(--color-border-default)] bg-transparent ps-2 pe-4 py-2 font-body font-medium text-lg leading-[21.78px] text-[var(--color-text-primary)] text-start outline-none [field-sizing:content] placeholder:text-[var(--color-text-primary)] placeholder:opacity-40 caret-[var(--color-primary)] transition-colors duration-150 focus:border-[var(--color-primary-soft)] focus-visible:border-[var(--color-primary-soft)] ${className ?? ''}`}
    />
  )
}
