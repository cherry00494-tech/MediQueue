export type TicketStatus =
  | 'Waiting'
  | 'Called'
  | 'In consultation'
  | 'Completed'
  | 'Missed'
  | 'Cancelled'

export interface QueueTicket {
  id: string
  ticket: string
  patientName: string
  service: string
  arrival: string
  status: TicketStatus
}

export const initialQueue: QueueTicket[] = [
  { id: 'q-001', ticket: 'OPD-014', patientName: 'Ama Owusu', service: 'General OPD', arrival: '08:12 AM', status: 'In consultation' },
  { id: 'q-002', ticket: 'OPD-015', patientName: 'Kojo Mensah', service: 'General OPD', arrival: '08:24 AM', status: 'Called' },
  { id: 'q-003', ticket: 'OPD-016', patientName: 'Abena Boateng', service: 'General OPD', arrival: '08:31 AM', status: 'Waiting' },
  { id: 'q-004', ticket: 'OPD-017', patientName: 'Kofi Asare', service: 'General OPD', arrival: '08:42 AM', status: 'Waiting' },
  { id: 'q-005', ticket: 'DENT-006', patientName: 'Efua Antwi', service: 'Dental', arrival: '08:46 AM', status: 'Waiting' },
  { id: 'q-006', ticket: 'EYE-003', patientName: 'Yaw Addo', service: 'Eye Clinic', arrival: '08:53 AM', status: 'Waiting' },
  { id: 'q-007', ticket: 'OPD-018', patientName: 'Adwoa Sarpong', service: 'General OPD', arrival: '09:01 AM', status: 'Waiting' },
  { id: 'q-008', ticket: 'DENT-007', patientName: 'Kwame Osei', service: 'Dental', arrival: '09:07 AM', status: 'Missed' },
]

export const pilotAppointments = [
  { patient: 'Ama Owusu', initials: 'AO', service: 'General OPD', time: '08:30 AM', status: 'Checked in' },
  { patient: 'Kojo Mensah', initials: 'KM', service: 'General OPD', time: '09:00 AM', status: 'Checked in' },
  { patient: 'Akua Frimpong', initials: 'AF', service: 'Dental', time: '09:15 AM', status: 'Confirmed' },
  { patient: 'Yaw Addo', initials: 'YA', service: 'Eye Clinic', time: '09:30 AM', status: 'Confirmed' },
]

export const pilotDepartments = [
  { name: 'General Outpatient', short: 'OPD', services: 3, staff: 8, waiting: 12, status: 'Open' },
  { name: 'Dental Clinic', short: 'DENT', services: 2, staff: 4, waiting: 5, status: 'Open' },
  { name: 'Eye Clinic', short: 'EYE', services: 2, staff: 3, waiting: 4, status: 'Open' },
  { name: 'Maternal Health', short: 'MCH', services: 3, staff: 6, waiting: 7, status: 'Open' },
]

export const pilotStaff = [
  { name: 'Dr. Esi Agyeman', role: 'Medical Officer', department: 'General Outpatient', shift: '07:00 AM – 03:00 PM', status: 'On duty' },
  { name: 'Nurse Kwaku Boateng', role: 'Registered Nurse', department: 'General Outpatient', shift: '07:00 AM – 03:00 PM', status: 'On duty' },
  { name: 'Dr. Akosua Tetteh', role: 'Dental Officer', department: 'Dental Clinic', shift: '08:00 AM – 04:00 PM', status: 'On duty' },
  { name: 'Nurse Sena Quaye', role: 'Registered Nurse', department: 'Maternal Health', shift: '07:00 AM – 03:00 PM', status: 'On break' },
]

export const pilotPatients = [
  { name: 'Ama Owusu', initials: 'AO', reference: 'PT-2081', lastVisit: 'Today, 08:12 AM', visits: 4 },
  { name: 'Kojo Mensah', initials: 'KM', reference: 'PT-2074', lastVisit: 'Today, 08:24 AM', visits: 2 },
  { name: 'Abena Boateng', initials: 'AB', reference: 'PT-2068', lastVisit: 'Today, 08:31 AM', visits: 3 },
  { name: 'Kofi Asare', initials: 'KA', reference: 'PT-2059', lastVisit: 'Today, 08:42 AM', visits: 1 },
]

export const pilotServices = [
  { name: 'General consultation', department: 'General Outpatient', duration: '20 min', capacity: '32 appointments/day', status: 'Active' },
  { name: 'Dental consultation', department: 'Dental Clinic', duration: '30 min', capacity: '18 appointments/day', status: 'Active' },
  { name: 'Eye examination', department: 'Eye Clinic', duration: '25 min', capacity: '20 appointments/day', status: 'Active' },
  { name: 'Antenatal visit', department: 'Maternal Health', duration: '30 min', capacity: '24 appointments/day', status: 'Active' },
]

export const pilotSchedules = [
  { day: 'Monday – Friday', hours: '07:00 AM – 05:00 PM', department: 'General Outpatient', capacity: '32 / day' },
  { day: 'Monday – Saturday', hours: '08:00 AM – 04:00 PM', department: 'Dental Clinic', capacity: '18 / day' },
  { day: 'Monday – Friday', hours: '08:00 AM – 04:00 PM', department: 'Eye Clinic', capacity: '20 / day' },
  { day: 'Monday – Friday', hours: '07:00 AM – 04:00 PM', department: 'Maternal Health', capacity: '24 / day' },
]

export const weeklyVisits = [
  { day: 'Mon', value: 68 },
  { day: 'Tue', value: 82 },
  { day: 'Wed', value: 73 },
  { day: 'Thu', value: 94 },
  { day: 'Fri', value: 88 },
  { day: 'Sat', value: 48 },
  { day: 'Sun', value: 18 },
]

export const serviceNames = ['General OPD', 'Dental', 'Eye Clinic', 'Maternal Health']

export const formatStatus = (status: TicketStatus | string) =>
  status.toLowerCase().replaceAll(' ', '-')
