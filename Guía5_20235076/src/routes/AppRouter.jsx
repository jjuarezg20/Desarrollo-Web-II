import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard/Dashboard'
import TaskDetails from '../pages/dashboard/TaskDetails'
import Layout from '../components/layout/Layout'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ProtectedRoute from './ProtectedRoute'

const getBasename = () => {
  const path = window.location.pathname
  const marker = '/dist/'
  const markerIndex = path.indexOf(marker)

  if (markerIndex !== -1) {
    return path.slice(0, markerIndex + marker.length - 1)
  }

  if (path.endsWith('/dist')) {
    return path
  }

  return undefined
}

export default function AppRouter() {
  const { isAuthenticated, isLoading, setUser, clearUser, setLoading } = useAuthStore()
  const clearTasks = useTaskStore((state) => state.clearTasks)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        })
      } else {
        clearUser()
        clearTasks()
      }

      setLoading(false)
    })

    return unsubscribe
  }, [clearTasks, clearUser, setLoading, setUser])

  if (isLoading) {
    return <LoadingSpinner />
  }

  const defaultRoute = isAuthenticated ? '/dashboard' : '/login'

  return (
    <BrowserRouter basename={getBasename()}>
      <Routes>
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        <Route path="/index.html" element={<Navigate to={defaultRoute} replace />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks/:taskId" element={<TaskDetails />} />
        </Route>

        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
