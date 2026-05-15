import { Link, useParams } from 'react-router-dom'
import Avatar from '@/components/Avatar'
import FieldLabel from '@/components/FieldLabel'
import NumericInput from '@/components/NumericInput'
import { useStore } from '@/store'

export default function PersonEdit() {
  const { id } = useParams<{ id: string }>()
  const person = useStore((state) => state.people.find((p) => p.id === Number(id)))
  const updatePersonAge = useStore((state) => state.updatePersonAge)

  if (!person) {
    return (
      <div>
        <p className="text-gray-600">Person not found</p>
        <Link to="/" className="text-link text-sm">
          Back to list
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-link text-sm">
        &larr; Back
      </Link>

      <div className="group flex items-center gap-4">
        <Avatar person={person} size="lg" />
        <div className="flex flex-col gap-3">
          <FieldLabel
            htmlFor="hours-input"
            className="group-focus-within:text-[var(--color-primary)]"
          >
            {person.name.toUpperCase()} IS
          </FieldLabel>
          <div className="flex items-center gap-3">
            <NumericInput
              id="hours-input"
              value={person.ageInHours}
              onChange={(hours) => updatePersonAge(person.id, hours)}
              placeholder="0"
              minWidthPx={72}
            />
            <span className="text-gray-700">hours old</span>
          </div>
        </div>
      </div>
    </div>
  )
}
