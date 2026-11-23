import { Download, FileText } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import {
  pilotAppointments,
  pilotDepartments,
  pilotPatients,
  pilotSchedules,
  pilotServices,
  pilotStaff,
  weeklyVisits,
} from '../data/pilotData'

const labels: Record<string, { title: string; description: string }> = {
  appointments: { title: 'Appointments', description: 'Review scheduled visits and attendance for the pilot hospital.' },
  patients: { title: 'Patients', description: 'Fictional, hospital-scoped patient directory for interface testing.' },
  departments: { title: 'Departments', description: 'A snapshot of departments and their operational queues.' },
  staff: { title: 'Staff management', description: 'Pilot staff directory and today’s duty status.' },
  services: { title: 'Services', description: 'Configured appointment services and daily capacity.' },
  schedules: { title: 'Schedules', description: 'Current operating hours and appointment capacity by department.' },
  analytics: { title: 'Analytics', description: 'Illustrative weekly patient visits using fictional pilot data.' },
  reports: { title: 'Reports', description: 'Download the fictional appointment summary as a CSV file.' },
  settings: { title: 'Hospital settings', description: 'Pilot workspace configuration overview.' },
}

export function WorkspacePage() {
  const [appointmentFilter, setAppointmentFilter] = useState('All appointments')
  const { section = '' } = useParams()
  const page = labels[section] ?? labels.appointments
  const filteredAppointments = useMemo(
    () => pilotAppointments.filter((appointment) => appointmentFilter === 'All appointments' || appointment.status === appointmentFilter),
    [appointmentFilter],
  )

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Hospital workspace</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
        {section === 'reports' && <button className="button-primary" type="button" onClick={downloadAppointments}><Download size={14} /> Download CSV</button>}
      </div>
      <div className="demo-notice" role="note"><FileText size={15} /><span>Fictional pilot data shown. This section is a read-only interface preview; editing and server-backed workflows are planned for later milestones.</span></div>
      {section === 'appointments' && (
        <section className="panel">
          <div className="panel-header">
            <div><h2 className="panel-title">Appointments today</h2><p className="panel-subtitle">Monday · fictional pilot schedule</p></div>
            <label><span className="sr-only">Filter appointments</span><select className="select-control" value={appointmentFilter} onChange={(event) => setAppointmentFilter(event.target.value)}><option>All appointments</option><option>Checked in</option><option>Confirmed</option></select></label>
          </div>
          <DataTable headers={['Patient', 'Service', 'Time', 'Status']} rows={filteredAppointments.map((item) => [<span className="patient-cell" key="patient"><span className="mini-avatar">{item.initials}</span>{item.patient}</span>, item.service, item.time, <StatusBadge key="status" status={item.status} />])} />
        </section>
      )}
      {section === 'departments' && <DataTable headers={['Department', 'Code', 'Services', 'Staff on duty', 'Waiting', 'Status']} rows={pilotDepartments.map((item) => [item.name, item.short, String(item.services), String(item.staff), String(item.waiting), <StatusBadge key="status" status={item.status} />])} />}
      {section === 'staff' && <DataTable headers={['Staff members', 'Role', 'Department', 'Shift', 'Status']} rows={pilotStaff.map((item) => [item.name, item.role, item.department, item.shift, <StatusBadge key="status" status={item.status} />])} />}
      {section === 'patients' && <DataTable headers={['Patient', 'Hospital reference', 'Last visit', 'Recorded visits']} rows={pilotPatients.map((item) => [<span className="patient-cell" key="patient"><span className="mini-avatar">{item.initials}</span>{item.name}</span>, item.reference, item.lastVisit, String(item.visits)])} />}
      {section === 'services' && <DataTable headers={['Service', 'Department', 'Average duration', 'Daily capacity', 'Status']} rows={pilotServices.map(item => [item.name, item.department, item.duration, item.capacity, <StatusBadge key="status" status={item.status} />])} />}
      {section === 'schedules' && <DataTable headers={['Operating days', 'Hours', 'Department', 'Appointments']} rows={pilotSchedules.map((item) => [item.day, item.hours, item.department, item.capacity])} />}
      {section === 'analytics' && <Analytics />}
      {section === 'reports' && <div className="workspace-grid"><InfoCard title="Appointment summary" value="48" description="Scheduled appointments in today’s fictional pilot data." /><InfoCard title="Checked-in patients" value="31" description="Patients marked checked in in the sample schedule." /><InfoCard title="Attendance snapshot" value="64.6%" description="Checked-in divided by scheduled appointments; sample only." /></div>}
      {section === 'settings' && <div className="workspace-grid"><InfoCard title="Facility" value="Aster Grove Hospital" description="Fictional pilot facility – Accra, Ghana" /><InfoCard title="Timezone" value="Africa/Accra" description="Local time used for this pilot interface." /><InfoCard title="Queue policy" value="Staff-managed" description="Staff control queue state; no automated clinical prioritization." /></div>}
      {!labels[section] && <InfoCard title="Workspace" value="Pilot preview" description="Choose a section from the hospital navigation." />}
    </>
  )
}

function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <section className="panel">
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  )
}

function InfoCard({ title, value, description }: { title: string; value: string; description: string }) {
  return <article className="panel workspace-card"><h2>{title}</h2><div className="card-value">{value}</div><p>{description}</p></article>
}

function Analytics() {
  return (
    <div className="workspace-grid">
      <article className="panel workspace-card" style={{ gridColumn: 'span 2' }}>
        <h2>Patient visits · this week</h2>
        <p>Daily visits · fictional pilot sample</p>
        <div className="bar-chart" role="img" aria-label="Bar chart showing daily visits for Monday through Sunday">
          {weeklyVisits.map((item) => <div className="bar-group" key={item.day}><div className="bar" style={{ height: `${item.value}%` }} title={`${item.day}: ${item.value} visits`} /><span className="bar-label">{item.day}</span></div>)}
        </div>
      </article>
      <InfoCard title="Average wait" value="24 min" description="Illustrative pilot value, not calculated from persisted visits." />
      <InfoCard title="Missed appointments" value="6" description="Illustrative count from fictional pilot data." />
      <InfoCard title="Peak arrival period" value="08:00–10:00" description="Example operational insight for the interface preview." />
    </div>
  )
}

function downloadAppointments() {
  const rows = [
    ['Patient', 'Service', 'Time', 'Status'],
    ...pilotAppointments.map(({ patient, service, time, status }) => [patient, service, time, status]),
  ]
  const csv = rows.map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'mediqueue-fictional-pilot-appointments.csv'
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
