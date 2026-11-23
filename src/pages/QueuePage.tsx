import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, Check, CircleAlert, Clock3, Plus, Search, UserRound, X } from 'lucide-react'
import { StatusBadge } from '../components/StatusBadge'
import { serviceNames, type QueueTicket, type TicketStatus } from '../data/pilotData'
import { useQueue } from '../features/queue/useQueue'

type QueueFilter = 'All patients' | 'Waiting' | 'In progress' | 'Completed'

const filters: QueueFilter[] = ['All patients', 'Waiting', 'In progress', 'Completed']

function getNextAction(status: TicketStatus): { label: string; next: TicketStatus; icon: typeof ArrowRight } | null {
  if (status === 'Waiting') return { label: 'Call patient', next: 'Called', icon: ArrowRight }
  if (status === 'Called') return { label: 'Start visit', next: 'In consultation', icon: UserRound }
  if (status === 'In consultation') return { label: 'Complete', next: 'Completed', icon: Check }
  return null
}

export function QueuePage() {
  const { tickets, updateStatus, addWalkIn } = useQueue()
  const [filter, setFilter] = useState<QueueFilter>('All patients')
  const [service, setService] = useState('All services')
  const [query, setQuery] = useState('')
  const [showWalkIn, setShowWalkIn] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  const visibleTickets = useMemo(() => tickets.filter((ticket) => {
    const matchesFilter =
      filter === 'All patients' ||
      (filter === 'Waiting' && ticket.status === 'Waiting') ||
      (filter === 'In progress' && ['Called', 'In consultation'].includes(ticket.status)) ||
      (filter === 'Completed' && ['Completed', 'Missed', 'Cancelled'].includes(ticket.status))
    const matchesService = service === 'All services' || ticket.service === service
    const matchesQuery = `${ticket.patientName} ${ticket.ticket}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesService && matchesQuery
  }), [tickets, filter, service, query])

  const counts = {
    waiting: tickets.filter((ticket) => ticket.status === 'Waiting').length,
    called: tickets.filter((ticket) => ticket.status === 'Called').length,
    inConsultation: tickets.filter((ticket) => ticket.status === 'In consultation').length,
    completed: tickets.filter((ticket) => ticket.status === 'Completed').length,
  }

  function showMessage(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  function callNext() {
    const next = tickets.find((ticket) => ticket.status === 'Waiting' && (service === 'All services' || ticket.service === service))
    if (!next) {
      showMessage('No waiting patients in this queue.')
      return
    }
    updateStatus(next.id, 'Called')
    showMessage(`${next.ticket} has been called.`)
  }

  function changeStatus(ticket: QueueTicket, status: TicketStatus) {
    updateStatus(ticket.id, status)
    showMessage(`${ticket.ticket} marked ${status.toLowerCase()}.`)
  }

  function handleWalkIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const patientName = String(formData.get('patientName') ?? '').trim()
    const walkInService = String(formData.get('service') ?? '')
    if (patientName.length < 2 || !serviceNames.includes(walkInService)) {
      setError('Enter a patient name and choose a service.')
      return
    }
    const created = addWalkIn(patientName, walkInService)
    setError('')
    setShowWalkIn(false)
    showMessage(`Walk-in added with ticket ${created.ticket}.`)
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Patient flow</p>
          <h1>Queue management</h1>
          <p>Monitor queues and update patient visits across hospital services.</p>
        </div>
        <button className="button-primary" type="button" onClick={() => setShowWalkIn(true)}>
          <Plus size={15} /> Add walk-in
        </button>
      </div>

      <div className="demo-notice" role="note">
        <CircleAlert size={15} />
        <span><strong>Demo mode:</strong> ticket allocation and status changes are stored only in React memory. They are not concurrency-safe or persisted; connect to the API before using real patient records.</span>
      </div>

      <section className="stats-grid" aria-label="Queue summary">
        <SummaryCard label="Waiting" count={counts.waiting} detail="Across active queues" icon={<Clock3 size={16} />} />
        <SummaryCard label="Called" count={counts.called} detail="Waiting at service point" icon={<ArrowRight size={16} />} />
        <SummaryCard label="In consultation" count={counts.inConsultation} detail="Currently being seen" icon={<UserRound size={16} />} />
        <SummaryCard label="Completed today" count={counts.completed} detail="Visits completed" icon={<Check size={16} />} />
      </section>

      <section className="panel queue-table-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Today’s patient queue</h2>
            <p className="panel-subtitle">Status changes here are sample-only and reset when this page is refreshed.</p>
          </div>
          <button className="button-secondary" type="button" onClick={callNext}>Call next <ArrowRight size={13} /></button>
        </div>
        <div className="queue-toolbar" style={{ padding: '0 18px 14px' }}>
          <div className="toolbar-left">
            <label className="search-box">
              <Search size={14} />
              <input aria-label="Search patients or ticket" placeholder="Search patient or ticket" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <label>
              <span className="sr-only">Filter by service</span>
              <select className="select-control" value={service} onChange={(event) => setService(event.target.value)}>
                <option>All services</option>
                {serviceNames.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
          </div>
          <div className="toolbar-right" aria-label="Queue status filter">
            {filters.map((item) => (
              <button
                className={filter === item ? 'button-primary' : 'button-secondary'}
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Ticket</th><th>Patient</th><th>Service</th><th>Check-in</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {visibleTickets.map((ticket) => {
                const nextAction = getNextAction(ticket.status)
                return (
                  <tr key={ticket.id}>
                    <td><span className="ticket-code">{ticket.ticket}</span></td>
                    <td><div className="patient-cell"><span className="mini-avatar">{ticket.patientName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>{ticket.patientName}</div></td>
                    <td>{ticket.service}</td>
                    <td>{ticket.arrival}</td>
                    <td><StatusBadge status={ticket.status} /></td>
                    <td>
                      <div className="queue-actions">
                        {nextAction && (
                          <button className="queue-action" type="button" onClick={() => changeStatus(ticket, nextAction.next)}>
                            <nextAction.icon size={12} /> {nextAction.label}
                          </button>
                        )}
                        {['Waiting', 'Called'].includes(ticket.status) && (
                          <button className="icon-button" type="button" aria-label={`Mark ${ticket.ticket} missed`} title="Mark absent" onClick={() => changeStatus(ticket, 'Missed')}>
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {visibleTickets.length === 0 && <tr><td className="empty-row" colSpan={6}>No queue entries match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {showWalkIn && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowWalkIn(false)
        }}>
          <form className="modal" onSubmit={handleWalkIn} aria-labelledby="walkin-title" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <h2 id="walkin-title">Register a walk-in</h2>
                <p className="modal-copy">Create a fictional queue entry for this demo session.</p>
              </div>
              <button className="icon-button" type="button" aria-label="Close dialog" onClick={() => setShowWalkIn(false)}><X size={17} /></button>
            </div>
            <div className="form-field">
              <label htmlFor="patientName">Patient display name</label>
              <input id="patientName" name="patientName" autoFocus maxLength={80} required placeholder="e.g. Ama Owusu" />
            </div>
            <div className="form-field">
              <label htmlFor="service">Service</label>
              <select id="service" name="service" required defaultValue={serviceNames[0]}>
                {serviceNames.map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="modal-actions">
              <button className="button-secondary" type="button" onClick={() => setShowWalkIn(false)}>Cancel</button>
              <button className="button-primary" type="submit"><Plus size={14} /> Add to queue</button>
            </div>
          </form>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}

function SummaryCard({ label, count, detail, icon }: { label: string; count: number; detail: string; icon: ReactNode }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><div className="stat-label">{label}</div><div className="stat-icon">{icon}</div></div>
      <div className="stat-value">{count}</div>
      <div className="stat-foot">{detail}</div>
    </article>
  )
}
