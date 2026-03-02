import { Link } from 'react-router-dom'
import { updateTask, deleteTask } from '../../services/taskService'
import { CATEGORIES, COLOR_STYLES } from '../../utils/constants'
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers'

export default function TaskCard({ task }) {
  const category = CATEGORIES.find((c) => c.id === task.category)
  const categoryStyle = COLOR_STYLES[category?.color] || COLOR_STYLES.gray

  const handleToggleComplete = async (e) => {
    e.preventDefault()
    await updateTask(task.id, { completed: !task.completed })
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return
    await deleteTask(task.id)
  }

  const cardStateClass = `${task.completed ? 'opacity-60' : ''} ${
    isOverdue(task.dueDate, task.completed) ? 'border border-red-300' : ''
  }`

  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <div className={`card hover:shadow-lg transition-shadow ${cardStateClass}`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>

            {task.description ? (
              <p className="text-gray-600 mt-2 line-clamp-2">{task.description}</p>
            ) : (
              <p className="text-gray-400 mt-2">Sin descripción</p>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryStyle}`}>
                {category?.label || 'Otros'}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {task.completed ? 'Completada' : 'Pendiente'}
              </span>

              {task.dueDate && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isOverdue(task.dueDate, task.completed)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  Vence: {getDueDateLabel(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
            <button
              onClick={handleToggleComplete}
              className={task.completed ? 'btn-secondary text-sm' : 'btn-primary text-sm'}
            >
              {task.completed ? 'Marcar pendiente' : 'Completar'}
            </button>
            <button onClick={handleDelete} className="btn-danger text-sm">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
