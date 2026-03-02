import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useTaskStore } from '../../store/taskStore'
import { logoutUser } from '../../services/authService'

export default function Navbar() {
  const { user, clearUser } = useAuthStore()
  const clearTasks = useTaskStore((state) => state.clearTasks)
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await logoutUser()

    if (result.success) {
      clearUser()
      clearTasks()
      navigate('/login')
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
              Task Manager Pro
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.displayName || user?.email}</span>
            <button onClick={handleLogout} className="btn-secondary">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
