import type { Person } from '@/store'

type Size = 'sm' | 'lg'

const sizeClass: Record<Size, string> = {
  sm: 'w-10 h-10 border-violet-500',
  lg: 'w-20 h-20 border-transparent group-focus-within:border-violet-600 transition-colors',
}

/**
 * Round photo of a person. Falls back to a grey placeholder when
 * `person.avatarUrl` is null.
 *
 * The `lg` variant participates in `:focus-within` of an ancestor with the
 * `group` Tailwind class, gaining a violet ring while the input is focused.
 */
export default function Avatar({
  person,
  size,
}: {
  person: Pick<Person, 'name' | 'avatarUrl'>
  size: Size
}) {
  const base = `${sizeClass[size]} rounded-full border-2`
  if (!person.avatarUrl) {
    return <div aria-hidden className={`${base} bg-[var(--color-avatar-placeholder)]`} />
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}${person.avatarUrl}`}
      alt={person.name}
      className={`${base} object-cover`}
    />
  )
}
