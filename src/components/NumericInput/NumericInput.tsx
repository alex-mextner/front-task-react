import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type Ref,
} from 'react'
import { NumericFormat, numericFormatter } from 'react-number-format'

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

// Width is JS-driven via an off-screen <span> that mirrors font and padding.
// `field-sizing: content` was tried but produces a 1–2px leading-digit clip
// on Safari/iOS when the caret sits at the end (the browser scrolls the
// content to keep the caret visible). A small lookahead buffer guarantees
// the input is always slightly wider than its content, in any browser.
const inputBaseClass =
  'h-11 rounded-md border border-[var(--color-border-default)] bg-transparent ps-2 pe-4 py-2 ' +
  'font-body font-medium text-lg leading-[21.78px] text-[var(--color-text-primary)] ' +
  'text-start outline-none ' +
  'placeholder:text-[var(--color-text-primary)] placeholder:opacity-40 ' +
  'caret-[var(--color-primary)] ' +
  'transition-[color,border-color,width] duration-150 ease-out ' +
  'focus:border-[var(--color-primary-soft)] focus-visible:border-[var(--color-primary-soft)]'

/** Lookahead absorbs caret + sub-pixel rounding + ~one upcoming digit. */
const LOOKAHEAD_PX = 15

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
  placeholder,
  className,
  style,
  ref,
  ...rest
}: NumericInputProps) {
  const sizerRef = useRef<HTMLSpanElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null)

  const formattedValue =
    value === null
      ? ''
      : numericFormatter(String(value), {
          thousandSeparator: ' ',
          decimalScale: allowDecimal ? undefined : 0,
          allowNegative,
        })

  const sizerText = formattedValue || (placeholder ?? '')

  useLayoutEffect(() => {
    if (sizerRef.current) {
      setMeasuredWidth(sizerRef.current.offsetWidth + LOOKAHEAD_PX)
    }
  }, [sizerText])

  const widthStyle: CSSProperties = {
    ...(measuredWidth !== null && { width: `${measuredWidth}px` }),
    ...(minWidthPx !== undefined && { minWidth: `${minWidthPx}px` }),
    ...(maxWidthPx !== undefined && { maxWidth: `${maxWidthPx}px` }),
  }

  return (
    <>
      <span
        ref={sizerRef}
        aria-hidden
        className={`${inputBaseClass} pointer-events-none invisible absolute -left-[9999px] top-0 whitespace-pre`}
      >
        {sizerText || ' '}
      </span>
      <NumericFormat
        {...rest}
        placeholder={placeholder}
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
        className={`${inputBaseClass} ${className ?? ''}`}
      />
    </>
  )
}
