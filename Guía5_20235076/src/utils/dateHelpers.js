import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (date) => {
  if (!date) return ''
  return format(date, 'dd/MM/yyyy', { locale: es })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return format(date, 'dd/MM/yyyy HH:mm', { locale: es })
}

export const getRelativeTime = (date) => {
  if (!date) return ''
  return formatDistanceToNow(date, { addSuffix: true, locale: es })
}

export const isOverdue = (dueDate, completed) => {
  if (!dueDate || completed) return false
  return isPast(dueDate) && !isToday(dueDate)
}

export const getDueDateLabel = (dueDate) => {
  if (!dueDate) return null

  if (isToday(dueDate)) return 'Hoy'
  if (isTomorrow(dueDate)) return 'Mañana'
  if (isPast(dueDate)) return 'Vencida'

  return formatDate(dueDate)
}
