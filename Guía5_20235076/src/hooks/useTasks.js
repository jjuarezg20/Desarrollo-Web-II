import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import { subscribeToTasks } from '../services/taskService'

export const useTasks = () => {
  const user = useAuthStore((state) => state.user)
  const { setTasks, setLoading } = useTaskStore()

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return undefined
    }

    setLoading(true)

    const unsubscribe = subscribeToTasks(user.uid, (tasks) => {
      setTasks(tasks)
    })

    return () => {
      unsubscribe()
    }
  }, [user, setTasks, setLoading])
}
