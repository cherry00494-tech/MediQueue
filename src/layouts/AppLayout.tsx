import {
  Activity,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Clock3,
  FileText,
  LayoutDashboard,
  Stethoscope,
  Users,
  UserRound,
  Settings,
  Building2,
  BriefcaseMedical,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navigation = [
  {
    label: 'WORKSPACE',
    links: [
      { to: '/', title: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/appointments', title: 'Appointments', icon: CalendarDays },
      { to: '/queue', title: 'Queue management', icon: ClipboardList },
      { to: '/patients', title: 'Patients', icon: Users },
    ],
  },
  {
    label: 'HOSPITAL',
    links: [
      { to: '/departments', title: 'Departments', icon: Building2 },
      { to: '/staff', title: 'Staff management', icon: UserRound },
      { to: '/services', title: 'Services', icon: BriefcaseMedical },
      { to: '/schedules', title: 'Schedules', icon: Clock3 },
    ],
  },
  {
    label: 'INSIGHTS',
    links: [
      { to: '/analytics', title: 'Analytics', icon: BarChart3 },
      { to: '/reports', title: 'Reports', icon: FileText },
      { to: '/settings', title: 'Hospital settings', icon: Settings },
    ],
  },
]

export function AppLayout() {
  const location = useLocation()
  const currentLabel = navigation.flatMap((group) => group.links)
    .find((link) => link.to === location.pathname)?.title ?? 'Overview'

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark"><Activity size={21} strokeWidth={2.2} /></div>
          <div className="brand-name">Medi<span>Queue</span></div>
        </div>
        <div className="pilot-tag">PILOT WORKSPACE · SAMPLE DATA</div>
        <nav className="side-nav">
          {navigation.map((group) => (
            <div key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.links.map(({ to, title, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{title}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-footer-title">Pilot environment</div>
          <div className="sidebar-footer-copy">Changes are held in this browser session and are not saved to a server.</div>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div className="crumb">Hospital workspace <span aria-hidden="true">/</span> <strong>{currentLabel}</strong></div>
          <div className="topbar-right">
            <div className="hospital-switcher"><Stethoscope size={16} /><span>Aster Grove Hospital</span></div>
            <div className="user-chip">
              <div className="avatar" aria-hidden="true">EA</div>
              <div>
                <div className="user-name">Esi Agyeman</div>
                <div className="user-role">Hospital administrator</div>
              </div>
            </div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}
