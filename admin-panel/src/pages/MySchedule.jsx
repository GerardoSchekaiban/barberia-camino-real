import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import TopBar from "../components/layout/TopBar";
import { useAuth } from "../hooks/useAuth";
import { useBarberSchedule, useUpdateBarberSchedule } from "../hooks/useBarbers";

const DAYS = [
  { value: 1, label: "Lunes"     },
  { value: 2, label: "Martes"    },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves"    },
  { value: 5, label: "Viernes"   },
  { value: 6, label: "Sábado"    },
  { value: 0, label: "Domingo"   },
];

const DEFAULT = DAYS.map(d => ({
  day_of_week:  d.value,
  start_time:   "09:00",
  end_time:     "18:00",
  lunch_start:  "14:00",
  lunch_end:    "15:00",
  active:       d.value !== 0,
  lunch_active: true,
}));

export default function MySchedule() {
  const { barber } = useAuth();
  const { data: existing = [] } = useBarberSchedule(barber?.id);
  const update = useUpdateBarberSchedule();
  const [schedule, setSchedule] = useState(DEFAULT);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    if (existing.length > 0) {
      setSchedule(DEFAULT.map(d => {
        const found = existing.find(e => e.day_of_week === d.day_of_week);
        if (!found) return d;
        return {
          ...d,
          ...found,
          active:       true,
          lunch_active: !!(found.lunch_start && found.lunch_end),
          lunch_start:  found.lunch_start?.slice(0, 5) || "14:00",
          lunch_end:    found.lunch_end?.slice(0, 5)   || "15:00",
        };
      }));
    }
  }, [existing]);

  const toggle       = idx => setSchedule(s => s.map((d, i) => i === idx ? { ...d, active:       !d.active       } : d));
  const toggleLunch  = idx => setSchedule(s => s.map((d, i) => i === idx ? { ...d, lunch_active: !d.lunch_active } : d));
  const setTime      = (idx, field, val) => setSchedule(s => s.map((d, i) => i === idx ? { ...d, [field]: val } : d));

  const handleSave = async () => {
    const active = schedule
      .filter(d => d.active)
      .map(({ day_of_week, start_time, end_time, lunch_start, lunch_end, lunch_active }) => ({
        day_of_week,
        start_time,
        end_time,
        lunch_start: lunch_active ? lunch_start : null,
        lunch_end:   lunch_active ? lunch_end   : null,
      }));
    await update.mutateAsync({ id: barber.id, schedule: active });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <TopBar title="Mi Horario" subtitle="Configura tus días, horas y horario de comida" />
      <div className="p-8 max-w-2xl">
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-cream-200">
            <p className="text-sm text-espresso-700 font-body opacity-70">
              Activa los días que trabajas y define tu horario incluyendo tu hora de comida.
            </p>
          </div>

          <div className="px-6 py-5 space-y-4">
            {schedule.map((day, idx) => {
              const label = DAYS.find(d => d.value === day.day_of_week)?.label;
              return (
                <div
                  key={day.day_of_week}
                  className={`rounded-xl border transition-all ${
                    day.active ? "border-cream-200 bg-cream-50" : "border-transparent opacity-40"
                  }`}
                >
                  {/* Fila principal */}
                  <div className="flex items-center gap-4 p-3">
                    <button
                      type="button"
                      onClick={() => toggle(idx)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
                        day.active ? "bg-gold-500 border-gold-500" : "border-cream-200 bg-white"
                      }`}
                    >
                      {day.active && <span className="text-xs font-bold text-espresso-900">✓</span>}
                    </button>
                    <span className="w-24 text-sm font-body font-medium text-espresso-900">{label}</span>
                    <input type="time" className="input text-xs py-1.5 w-28" value={day.start_time}
                      onChange={e => setTime(idx, "start_time", e.target.value)} disabled={!day.active} />
                    <span className="text-espresso-400 text-sm">—</span>
                    <input type="time" className="input text-xs py-1.5 w-28" value={day.end_time}
                      onChange={e => setTime(idx, "end_time", e.target.value)} disabled={!day.active} />
                  </div>

                  {/* Fila de comida */}
                  {day.active && (
                    <div className="flex items-center gap-4 px-3 pb-3 pl-12">
                      <button
                        type="button"
                        onClick={() => toggleLunch(idx)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                          day.lunch_active ? "bg-espresso-800 border-espresso-800" : "border-cream-200 bg-white"
                        }`}
                      >
                        {day.lunch_active && <span className="text-xs font-bold text-white">✓</span>}
                      </button>
                      <span className="text-xs text-espresso-700 opacity-60 font-body w-20">🍽 Comida</span>
                      <input type="time" className="input text-xs py-1 w-28" value={day.lunch_start}
                        onChange={e => setTime(idx, "lunch_start", e.target.value)} disabled={!day.lunch_active} />
                      <span className="text-espresso-400 text-xs">—</span>
                      <input type="time" className="input text-xs py-1 w-28" value={day.lunch_end}
                        onChange={e => setTime(idx, "lunch_end", e.target.value)} disabled={!day.lunch_active} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-6 pb-6 flex items-center justify-between">
            {saved ? (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-body">
                <CheckCircle size={15} /> Horario guardado
              </span>
            ) : <span />}
            <button onClick={handleSave} disabled={update.isPending} className="btn-primary">
              {update.isPending ? "Guardando..." : "Guardar horario"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}