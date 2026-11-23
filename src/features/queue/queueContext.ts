import { createContext } from 'react'
import type { QueueTicket, TicketStatus } from '../../data/pilotData'

export interface QueueContextValue {
  tickets: QueueTicket[]
  updateStatus: (id: string, status: TicketStatus) => void
  addWalkIn: (patientName: string, service: string) => QueueTicket
}

export const QueueContext = createContext<QueueContextValue | null>(null)
