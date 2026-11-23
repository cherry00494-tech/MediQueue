import { useContext } from 'react'
import { QueueContext } from './queueContext'

export function useQueue() {
  const context = useContext(QueueContext)
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider')
  }
  return context
}
