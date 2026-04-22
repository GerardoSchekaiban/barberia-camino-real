import { useState } from 'react'
import { Plus, Clock, Edit2 } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import BarberModal from '../components/barbers/BarberModal'
import ScheduleModal from '../components/barbers/ScheduleModal'
import { useBarbers } from '../hooks/useBarbers'

export default function Barbers() {
  const { data: barbers = [], isLoading } = useBarbers()
  const [editBarber, setEditBarber] = useState(null)
  const [scheduleBarber, setScheduleBarber] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      <TopBar title="Barberos" subtitle="Equipo de trabajo" />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-espresso-700 opacity-60 font-body">{barbers.length} barberos registrados</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Agregar barbero
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-sm text-espresso-700 opacity-50">Cargando...</div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {barbers.map(b => (
              <div key={b.id} className="card p-6">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-espresso-800 flex items-center justify-center mb-4">
                  <span className="font-display text-xl font-semibold text-cream-50">
                    {b.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-espresso-900">{b.name}</h3>
                {b.phone && <p className="text-xs text-espresso-700 opacity-60 font-body mt-1">{b.phone}</p>}

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => setScheduleBarber(b)}
                    className="flex-1 flex items-center justify-center gap-1.5 btn-ghost text-xs border border-cream-200"
                  >
                    <Clock size={13} /> Horario
                  </button>
                  <button
                    onClick={() => setEditBarber(b)}
                    className="flex-1 flex items-center justify-center gap-1.5 btn-ghost text-xs border border-cream-200"
                  >
                    <Edit2 size={13} /> Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showCreate || editBarber) && (
        <BarberModal
          barber={editBarber}
          onClose={() => { setShowCreate(false); setEditBarber(null) }}
        />
      )}
      {scheduleBarber && (
        <ScheduleModal
          barber={scheduleBarber}
          onClose={() => setScheduleBarber(null)}
        />
      )}
    </>
  )
}
