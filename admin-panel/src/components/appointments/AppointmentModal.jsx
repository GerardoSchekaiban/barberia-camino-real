import { useState } from "react"
import { X } from "lucide-react"
import { format } from "date-fns"
import { useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from "../../hooks/useAppointments"

const SERVICES = ["Corte", "Barba", "Corte y Barba", "Arreglo de cejas", "Tratamiento capilar"]

// Duración visual por servicio (solo para referencia en UI)
const SERVICE_DURATION = {
  "Corte":               "30 min",
  "Barba":               "60 min",
  "Corte y Barba":       "60 min",
  "Arreglo de cejas":    "30 min",
  "Tratamiento capilar": "60 min",
}

export default function AppointmentModal({ appointment, defaultDate, onClose }) {
  const isEdit = !!appointment

  const [form, setForm] = useState({
    client_name:  appointment?.client_name  ?? "",
    client_phone: appointment?.client_phone ?? "",
    service:      appointment?.service      ?? SERVICES[0],
    start_at:     appointment?.start_at
      ? format(new Date(appointment.start_at), "yyyy-MM-dd'T'HH:mm")
      : defaultDate
        ? format(defaultDate, "yyyy-MM-dd'T'HH:mm")
        : "",
  })

  const create  = useCreateAppointment()
  const update  = useUpdateAppointment()
  const remove  = useDeleteAppointment()
  const loading = create.isPending || update.isPending || remove.isPending

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isEdit) {
      await update.mutateAsync({ id: appointment.id, ...form })
    } else {
      await create.mutateAsync(form)
    }
    onClose()
  }

  const handleDelete = async () => {
    if (confirm("¿Eliminar esta cita?")) {
      await remove.mutateAsync(appointment.id)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="font-display text-base font-semibold text-espresso-900">
            {isEdit ? "Editar cita" : "Nueva cita"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-cream-100 rounded-lg transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Nombre del cliente */}
          <div>
            <label className="label">Nombre del cliente</label>
            <input
              className="input"
              type="text"
              placeholder="Ej. Carlos Martínez"
              value={form.client_name}
              onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="label">Teléfono</label>
            <input
              className="input"
              type="tel"
              placeholder="+52 1 833 000 0000"
              value={form.client_phone}
              onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))}
              required
            />
          </div>

          {/* Servicio */}
          <div>
            <label className="label">Servicio</label>
            <select
              className="input"
              value={form.service}
              onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
            >
              {SERVICES.map(s => (
                <option key={s} value={s}>{s} — {SERVICE_DURATION[s]}</option>
              ))}
            </select>
          </div>

          {/* Fecha y hora */}
          <div>
            <label className="label">Fecha y hora</label>
            <input
              className="input"
              type="datetime-local"
              value={form.start_at}
              onChange={e => setForm(f => ({ ...f, start_at: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="text-xs text-razor-500 hover:text-razor-600 font-medium font-body transition"
              >
                Eliminar cita
              </button>
            ) : <span />}

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear cita"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
