import { CalendarCheck, Clock, Users, TrendingUp } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import StatCard from '../components/dashboard/StatCard'
import { useAppointments } from '../hooks/useAppointments'
import { useBarbers } from '../hooks/useBarbers'
import { format, startOfDay, endOfDay, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Dashboard() {
  const { data: appointments = [] } = useAppointments()
  const { data: barbers = [] } = useBarbers()

  const today = appointments.filter(a => isToday(new Date(a.start_at)))
  const pending = appointments.filter(a => a.status === 'pending')

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle={format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
      />
      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          <StatCard icon={CalendarCheck} label="Citas hoy"      value={today.length}        color="gold" />
          <StatCard icon={Clock}         label="Pendientes"     value={pending.length}       color="red" />
          <StatCard icon={Users}         label="Barberos activos" value={barbers.length}     color="espresso" />
          <StatCard icon={TrendingUp}    label="Total citas"    value={appointments.length}  color="green" />
        </div>

        {/* Citas de hoy */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-espresso-900">Citas de hoy</h2>
            <span className="text-xs bg-gold-400/15 text-gold-600 font-medium px-2.5 py-1 rounded-full">
              {today.length} citas
            </span>
          </div>
          {today.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-espresso-700 opacity-50 font-body">
              No hay citas programadas para hoy
            </div>
          ) : (
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-espresso-700 opacity-50 bg-cream-50">
                  <th className="px-6 py-3">Hora</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Servicio</th>
                  <th className="px-6 py-3">Barbero</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {today.map(a => (
                  <tr key={a.id} className="hover:bg-cream-50 transition">
                    <td className="px-6 py-3.5 font-medium text-espresso-900">
                      {format(new Date(a.start_at), 'HH:mm')}
                    </td>
                    <td className="px-6 py-3.5 text-espresso-800">{a.client_name || a.client_phone}</td>
                    <td className="px-6 py-3.5 text-espresso-800">{a.service}</td>
                    <td className="px-6 py-3.5 text-espresso-800">{a.barber_name || `#${a.barber_id}`}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        a.status?.toUpperCase() === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                        a.status?.toUpperCase() === 'PENDING'   ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {a.status === 'CONFIRMED' ? 'Confirmada' :
                         a.status === 'PENDING'   ? 'Pendiente'  : 'Cancelada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
