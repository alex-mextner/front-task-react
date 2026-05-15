import { Link } from 'react-router-dom'
import FieldLabel from '@/components/FieldLabel'
import NumericInput from '@/components/NumericInput'
import { useStore } from '@/store'

export default function Settings() {
  const minimumAgeInMonths = useStore((state) => state.minimumAgeInMonths)
  const setMinimumAgeInMonths = useStore((state) => state.setMinimumAgeInMonths)

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-link text-sm">
        &larr; Back
      </Link>

      <h1 className="text-xl font-bold text-gray-700">Settings</h1>

      <div className="flex flex-col gap-3">
        <FieldLabel htmlFor="min-age-input">MINIMUM AGE</FieldLabel>
        <div className="flex items-center gap-3">
          <NumericInput
            id="min-age-input"
            value={minimumAgeInMonths}
            onChange={setMinimumAgeInMonths}
            placeholder="0"
            minWidthPx={72}
          />
          <span className="text-gray-700">months</span>
        </div>
      </div>
    </div>
  )
}
