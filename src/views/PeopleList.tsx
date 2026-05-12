import { Link } from 'react-router-dom'
import { useStore } from '@/store'

export default function PeopleList() {
  const people = useStore((state) => state.people)

  const peopleWithYears = people.map((person) => ({
    ...person,
    ageInYears: Math.floor(person.ageInHours / 8760),
  }))

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-700">People</h1>

      <div className="flex flex-col gap-3">
        {peopleWithYears.map((person) => (
          <Link
            key={person.id}
            to={`/person/${person.id}`}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-500"
          >
            <img
              src="/img.png"
              alt={person.name}
              className="w-10 h-10 rounded-full border-2 border-violet-500 object-cover"
            />
            <div>
              <div className="font-bold text-gray-700">{person.name}</div>
              <div className="text-gray-600">{person.ageInYears} years old</div>
            </div>
          </Link>
        ))}
      </div>

      <Link to="/settings" className="text-violet-600 hover:underline text-sm">
        Settings
      </Link>
    </div>
  )
}
