import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}
