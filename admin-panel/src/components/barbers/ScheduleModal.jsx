import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useBarberSchedule, useUpdateBarberSchedule } from '../../hooks/useBarbers'

const DAYS = [
  { value: 1, label: 'Lunes'     },
  { value: 2, label: 'Martes'    },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves'    },
  { value: 5, label: 'Viernes'   },
  { value: 6, label: 'Sábado'    },
  { value: 0, label: 'Domingo'   },
]

const DEFAULT_SCHEDULE = DAYS.map(d => ({
  day_of_week: d.value,
  start_time:  '09:00',
  end_time:    '18:00',
  active:      d.value !== 0,
}))

export default function ScheduleModal({ barber, onClose }) {
  const { data: existing = [] } = useBarberSchedule(barber.id)
  const update = useUpdateBarberSchedule()

  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)

  useEffect(() => {
    if (existing.length > 0) {
      setSchedule(DEFAULT_SCHEDULE.map(d => {
        const found = existing.find(e => e.day_of_week === d.day_of_week)
        return found ? { ...d, ...found, active: true } : d
      }))
    }
  }, [existing])

  const toggle = (idx) =>
    setSchedule(s => s.map((d, i) => i === idx ? { ...d, active: !d.active } : d))

  const setTime = (idx, field, val) =>
    setSchedule(s => s.map((d, i) => i === idx ? { ...d, [field]: val } : d))

  const handleSave = async () => {
    const active = schedule.filter(d => d.active).map(({ day_of_week, start_time, end_time }) => ({
      day_of_week, start_time, end_time
    }))
    await update.mutateAsync({ id: barber.id, schedule: active })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="font-display text-base font-semibold text-espresso-900">
            Horario — {barber.name}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-cream-100 rounded-lg transition"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {schedule.map((day, idx) => {
            const dayLabel = DAYS.find(d => d.value === day.day_of_week)?.label
            return (
              <div key={day.day_of_week} className={`flex items-center gap-4 p-3 rounded-xl transition ${day.active ? 'bg-cream-50' : 'opacity-40'}`}>
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className={`w-4 h-4 rounded border-2 transition flex-shrink-0 ${day.active ? 'bg-gold-500 border-gold-500' : 'border-cream-200'}`}
                />
                <span className="w-20 text-sm font-body font-medium text-espresso-900">{dayLabel}</span>
                <input
                  type="time" className="input text-xs py-1.5" value={day.start_time}
                  onChange={e => setTime(idx, 'start_time', e.target.value)}
                  disabled={!day.active}
                />
                <span className="text-espresso-700 opacity-40 text-sm">→</span>
                <input
                  type="time" className="input text-xs py-1.5" value={day.end_time}
                  onChange={e => setTime(idx, 'end_time', e.target.value)}
                  disabled={!day.active}
                />
              </div>
            )
          })}
        </div>
        <div className="flex justify-end gap-2 px-6 pb-5">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={handleSave} disabled={update.isPending} className="btn-primary">
            {update.isPending ? 'Guardando...' : 'Guardar horario'}
          </button>
        </div>
      </div>
    </div>
  )
}
