import { Link } from 'react-router-dom'
import { useStore } from '@/store'

const HOURS_PER_MONTH = 8760 / 12

export default function PeopleList() {
  const people = useStore((state) => state.people)
  const minimumAgeInMonths = useStore((state) => state.minimumAgeInMonths)

  const visible = people
    .filter(
      (person) =>
        minimumAgeInMonths === null ||
        person.ageInHours === null ||
        person.ageInHours >= minimumAgeInMonths * HOURS_PER_MONTH,
    )
    .map((person) => ({
      ...person,
      ageInYears:
        person.ageInHours === null ? null : Math.floor(person.ageInHours / 8760),
    }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-700">People</h1>
        <Link to="/settings" className="text-violet-600 hover:underline text-sm">
          Filter
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((person) => (
          <Link
            key={person.id}
            to={`/person/${person.id}`}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-500"
          >
            {person.avatarUrl ? (
              <img
                src={`${import.meta.env.BASE_URL}${person.avatarUrl}`}
                alt={person.name}
                className="w-10 h-10 rounded-full border-2 border-violet-500 object-cover"
              />
            ) : (
              <div
                aria-hidden
                className="w-10 h-10 rounded-full border-2 border-violet-500 bg-[var(--color-avatar-placeholder)]"
              />
            )}
            <div>
              <div className="font-bold text-gray-700">{person.name}</div>
              <div className="text-gray-600">
                {person.ageInYears === null ? 'age unknown' : `${person.ageInYears} years old`}
              </div>
            </div>
          </Link>
        ))}

        {visible.length === 0 && (
          <p className="text-sm text-gray-500">
            No people match the minimum age filter.{' '}
            <Link to="/settings" className="text-violet-600 hover:underline">
              Adjust filter
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  )
}
