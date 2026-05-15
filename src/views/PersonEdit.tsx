import { Link, useParams } from 'react-router-dom'
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
        <Link to="/" className="text-violet-600 hover:underline text-sm">
          Back to list
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-violet-600 hover:underline text-sm">
        &larr; Back
      </Link>

      <div className="group flex items-center gap-4">
        {person.avatarUrl ? (
          <img
            src={`${import.meta.env.BASE_URL}${person.avatarUrl}`}
            alt={person.name}
            className="w-20 h-20 rounded-full border-2 border-transparent group-focus-within:border-violet-600 object-cover transition-colors"
          />
        ) : (
          <div
            aria-hidden
            className="w-20 h-20 rounded-full border-2 border-transparent group-focus-within:border-violet-600 bg-[var(--color-avatar-placeholder)] transition-colors"
          />
        )}
        <div className="flex flex-col gap-3">
          <label
            htmlFor="hours-input"
            className="block text-sm tracking-wide text-gray-700 group-focus-within:text-violet-700"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {person.name.toUpperCase()} IS
          </label>
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
