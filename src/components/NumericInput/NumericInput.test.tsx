import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import NumericInput from './NumericInput'

afterEach(cleanup)

const setup = (initial: number | null, overrides: Partial<React.ComponentProps<typeof NumericInput>> = {}) => {
  const onChange = vi.fn<(v: number | null) => void>()
  const utils = render(
    <NumericInput aria-label="amount" value={initial} onChange={onChange} {...overrides} />,
  )
  return { onChange, input: screen.getByRole('textbox') as HTMLInputElement, ...utils }
}

describe('NumericInput', () => {
  it('renders without crashing', () => {
    setup(null)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows empty value when value is null', () => {
    const { input } = setup(null)
    expect(input.value).toBe('')
  })

  it('shows "0" when value is 0', () => {
    const { input } = setup(0)
    expect(input.value).toBe('0')
  })

  it('shows "1 000" when value is 1000', () => {
    const { input } = setup(1000)
    expect(input.value).toBe('1 000')
  })

  it('shows "1 000 000" when value is 1000000', () => {
    const { input } = setup(1000000)
    expect(input.value).toBe('1 000 000')
  })

  it('filters letters while typing', async () => {
    const { input, onChange } = setup(null)
    const user = userEvent.setup()
    await user.type(input, 'a1b2c3')
    expect(input.value).toBe('123')
    expect(onChange).toHaveBeenLastCalledWith(123)
  })

  it('filters letters on paste', async () => {
    const { input, onChange } = setup(null)
    const user = userEvent.setup()
    await user.click(input)
    await user.paste('abc123')
    expect(input.value).toBe('123')
    expect(onChange).toHaveBeenLastCalledWith(123)
  })

  it('strips spaces on paste', async () => {
    const { input, onChange } = setup(null)
    const user = userEvent.setup()
    await user.click(input)
    await user.paste('1 000 000')
    expect(input.value).toBe('1 000 000')
    expect(onChange).toHaveBeenLastCalledWith(1000000)
  })

  it('rejects dot while typing in default integer mode', async () => {
    const { input, onChange } = setup(null)
    const user = userEvent.setup()
    await user.type(input, '1.5')
    expect(input.value).toBe('15')
    expect(onChange).toHaveBeenLastCalledWith(15)
  })

  it('rejects comma while typing in default integer mode', async () => {
    const { input } = setup(null)
    const user = userEvent.setup()
    await user.type(input, '1,5')
    expect(input.value).toBe('15')
  })

  it('rejects "+" prefix while typing', async () => {
    const { input } = setup(null)
    const user = userEvent.setup()
    await user.type(input, '+12')
    expect(input.value).toBe('12')
  })

  it('rejects "-" prefix when allowNegative is false (default)', async () => {
    const { input } = setup(null)
    const user = userEvent.setup()
    await user.type(input, '-5')
    expect(input.value).toBe('5')
  })

  it('allows "-" prefix when allowNegative is true', async () => {
    const { input, onChange } = setup(null, { allowNegative: true })
    const user = userEvent.setup()
    await user.type(input, '-5')
    expect(input.value).toBe('-5')
    expect(onChange).toHaveBeenLastCalledWith(-5)
  })

  it('allows decimals when allowDecimal is true', async () => {
    const { input, onChange } = setup(null, { allowDecimal: true })
    const user = userEvent.setup()
    await user.type(input, '1.5')
    expect(input.value).toBe('1.5')
    expect(onChange).toHaveBeenLastCalledWith(1.5)
  })

  it('rejects scientific notation on paste', async () => {
    const { input, onChange } = setup(null)
    const user = userEvent.setup()
    await user.click(input)
    await user.paste('1e2')
    // "e" is stripped; "1" and "2" remain.
    expect(input.value).toBe('12')
    expect(onChange).toHaveBeenLastCalledWith(12)
  })

  it('calls onChange with a number, not a formatted string', async () => {
    const { input, onChange } = setup(null)
    const user = userEvent.setup()
    await user.type(input, '1234')
    expect(onChange).toHaveBeenLastCalledWith(1234)
  })

  it('enforces maxDigits (default 12)', async () => {
    const { input } = setup(null)
    const user = userEvent.setup()
    await user.type(input, '1234567890123') // 13 digits
    expect(input.value.replace(/\D/g, '').length).toBe(12)
  })

  it('respects custom maxDigits=3', async () => {
    const { input } = setup(null, { maxDigits: 3 })
    const user = userEvent.setup()
    await user.type(input, '12345')
    expect(input.value).toBe('123')
  })

  it('backspace removes one digit and reformats', async () => {
    const { input, onChange } = setup(1234)
    const user = userEvent.setup()
    expect(input.value).toBe('1 234')
    await user.click(input)
    // place caret at end
    input.setSelectionRange(input.value.length, input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe('123')
    expect(onChange).toHaveBeenLastCalledWith(123)
  })

  it('backspace to empty calls onChange(null)', async () => {
    const { input, onChange } = setup(5)
    const user = userEvent.setup()
    await user.click(input)
    input.setSelectionRange(input.value.length, input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe('')
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('typing "0" yields onChange(0), not null', async () => {
    const { input, onChange } = setup(null)
    const user = userEvent.setup()
    await user.type(input, '0')
    expect(input.value).toBe('0')
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('forwards ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<NumericInput aria-label="ref-test" value={null} onChange={() => {}} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('passes aria-label through to the input', () => {
    setup(null, { 'aria-label': 'custom-label' })
    expect(screen.getByLabelText('custom-label')).toBeInTheDocument()
  })

  it('uses inputMode="numeric" by default', () => {
    const { input } = setup(null)
    expect(input).toHaveAttribute('inputmode', 'numeric')
  })

  it('uses inputMode="decimal" when allowDecimal is true', () => {
    const { input } = setup(null, { allowDecimal: true })
    expect(input).toHaveAttribute('inputmode', 'decimal')
  })

  it('has class "numeric-input" on the rendered input', () => {
    const { input } = setup(null)
    expect(input).toHaveClass('numeric-input')
  })

  it('merges custom className with "numeric-input"', () => {
    const { input } = setup(null, { className: 'extra-class' })
    expect(input).toHaveClass('numeric-input', 'extra-class')
  })

  it('applies minWidthPx as inline style.minWidth', () => {
    const { input } = setup(null, { minWidthPx: 72 })
    expect(input.style.minWidth).toBe('72px')
  })

  it('does not set minWidth when minWidthPx is omitted', () => {
    const { input } = setup(null)
    expect(input.style.minWidth).toBe('')
  })

  it('applies maxWidthPx as inline style.maxWidth', () => {
    const { input } = setup(null, { maxWidthPx: 200 })
    expect(input.style.maxWidth).toBe('200px')
  })

  it('inherits dir from parent context (no override on input)', () => {
    render(
      <div dir="rtl">
        <NumericInput aria-label="rtl-test" value={1000} onChange={() => {}} />
      </div>,
    )
    const input = screen.getByLabelText('rtl-test') as HTMLInputElement
    expect(input.getAttribute('dir')).toBeNull()
    expect(input.value).toBe('1 000')
  })
})
