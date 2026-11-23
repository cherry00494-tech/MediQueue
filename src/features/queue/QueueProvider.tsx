import { useMemo, useState, type ReactNode } from 'react'
import { initialQueue, type QueueTicket, type TicketStatus } from '../../data/pilotData'
import { QueueContext, type QueueContextValue } from './queueContext'

export function QueueProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState(initialQueue)

  const value = useMemo<QueueContextValue>(() => ({
    tickets,
    updateStatus: (id: string, status: TicketStatus) => {
      setTickets((current) =>
        current.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)),
      )
    },
    addWalkIn: (patientName: string, service: string) => {
      const prefixes: Record<string, string> = {
        'General OPD': 'OPD',
        Dental: 'DENT',
        'Eye Clinic': 'EYE',
        'Maternal Health': 'MCH',
      }
      const prefix = prefixes[service] ?? 'OPD'
      const currentNumber = tickets
        .filter((ticket) => ticket.ticket.startsWith(`${prefix}-`))
        .reduce((max, ticket) => Math.max(max, Number(ticket.ticket.split('-')[1]) || 0), 0)
      const ticket: QueueTicket = {
        id: `demo-${Date.now()}`,
        ticket: `${prefix}-${String(currentNumber + 1).padStart(3, '0')}`,
        patientName,
        service,
        arrival: new Intl.DateTimeFormat('en-GH', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Africa/Accra',
        }).format(new Date()),
        status: 'Waiting',
      }
      setTickets((current) => [...current, ticket])
      return ticket
    },
  }), [tickets])

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
}
