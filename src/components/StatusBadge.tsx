import { formatStatus } from '../data/pilotData'

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-pill status-${formatStatus(status)}`}>{status}</span>
}
