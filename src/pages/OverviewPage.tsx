import {
  ArrowDownRight,
  ArrowRight,
  CalendarCheck2,
  Clock3,
  Stethoscope,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { pilotAppointments, pilotDepartments } from '../data/pilotData'
import { useQueue } from '../features/queue/useQueue'

const metricIcons = [CalendarCheck2, UsersRound, Clock3, Stethoscope]
const pageLoadTime = new Date()
const dateLabel = new Intl.DateTimeFormat('en-GH', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Africa/Accra',
}).format(pageLoadTime)
const hour = Number(new Intl.DateTimeFormat('en-GH', {
  hour: 'numeric',
  hour12: false,
  timeZone: 'Africa/Accra',
}).format(pageLoadTime))
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

export function OverviewPage() {
  const { tickets } = useQueue()
  const waiting = tickets.filter((ticket) => ticket.status === 'Waiting').length
  const attending = tickets.filter((ticket) => ticket.status === 'In consultation').length
  const metrics = [
    { label: 'Appointments today', value: '48', note: '4 more than yesterday', positive: true },
    { label: 'Patients checked in', value: '31', note: 'Across 4 departments', positive: false },
    { label: 'Currently waiting', value: String(waiting), note: 'Across active queues', positive: false },
    { label: 'In consultation', value: String(attending), note: 'Across service counters', positive: false },
  ]

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{dateLabel}</p>
          <h1>{greeting}, Esi</h1>
          <p>Here’s what’s happening across your hospital today.</p>
        </div>
        <div className="date-chip"><Clock3 size={14} /> Accra · GMT</div>
      </div>

      <div className="demo-notice" role="note">
        <ArrowDownRight size={15} />
        <span><strong>Fictional pilot data.</strong> This workspace is for interface testing only. Queue actions update the current browser session and reset on refresh; no patient or hospital data is stored or transmitted.</span>
      </div>

      <section className="stats-grid" aria-label="Today's hospital statistics">
        {metrics.map((metric, index) => {
          const Icon = metricIcons[index]
          return (
            <article className="stat-card" key={metric.label}>
              <div className="stat-top">
                <div className="stat-label">{metric.label}</div>
                <div className="stat-icon"><Icon size={16} /></div>
              </div>
              <div className="stat-value">{metric.value}</div>
              <div className="stat-foot">
                {metric.positive && <span className="positive">+9%</span>}
                <span>{metric.note}</span>
              </div>
            </article>
          )
        })}
      </section>

      <div className="overview-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Today’s appointments</h2>
              <p className="panel-subtitle">A quick view of the next scheduled visits</p>
            </div>
            <Link className="text-link" to="/appointments">View all <ArrowRight size={13} /></Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Patient</th><th>Service</th><th>Time</th><th>Status</th></tr>
              </thead>
              <tbody>
                {pilotAppointments.map((appointment) => (
                  <tr key={`${appointment.patient}-${appointment.time}`}>
                    <td><div className="patient-cell"><span className="mini-avatar">{appointment.initials}</span>{appointment.patient}</div></td>
                    <td>{appointment.service}</td>
                    <td>{appointment.time}</td>
                    <td><StatusBadge status={appointment.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Department queues</h2>
              <p className="panel-subtitle">Patients currently waiting</p>
            </div>
            <Link className="text-link" to="/queue">Open queues <ArrowRight size={13} /></Link>
          </div>
          <div className="service-list">
            {pilotDepartments.map((department) => (
              <div className="service-row" key={department.short}>
                <div>
                  <div className="service-name">{department.name}</div>
                  <div className="service-meta">{department.staff} staff on duty · {department.status}</div>
                </div>
                <div className="service-count">{department.waiting}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
