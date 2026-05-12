import { Routes, Route } from 'react-router-dom'
import PeopleList from '@/views/PeopleList'
import PersonEdit from '@/views/PersonEdit'
import Settings from '@/views/Settings'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Routes>
        <Route path="/" element={<PeopleList />} />
        <Route path="/person/:id" element={<PersonEdit />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}
