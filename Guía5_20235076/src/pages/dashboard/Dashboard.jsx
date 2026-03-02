import { useAuthStore } from '../../store/authStore'
import { useTaskStore } from '../../store/taskStore'
import { useTasks } from '../../hooks/useTasks'
import TaskFilters from '../../components/tasks/TaskFilters'
import TaskList from '../../components/tasks/TaskList'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const { tasks, currentFilter, currentCategory, loading } = useTaskStore()

  useTasks()

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'completed' && !task.completed) return false
    if (currentFilter === 'pending' && task.completed) return false

    if (currentCategory !== 'all' && task.category !== currentCategory) return false

    return true
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido, {user?.displayName || 'Usuario'}</h1>
        <p className="text-gray-600 mt-2">Tienes {tasks.filter((t) => !t.completed).length} tareas pendientes</p>
      </div>

      <TaskFilters />

      <TaskList tasks={filteredTasks} />
    </div>
  )
}
