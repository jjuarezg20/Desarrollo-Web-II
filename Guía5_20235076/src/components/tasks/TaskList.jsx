import { useState } from 'react'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'

export default function TaskList({ tasks }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Mis Tareas ({tasks.length})</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Nueva Tarea
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TaskForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No hay tareas para mostrar</p>
          <p className="text-gray-400 mt-2">Crea una nueva tarea para comenzar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
