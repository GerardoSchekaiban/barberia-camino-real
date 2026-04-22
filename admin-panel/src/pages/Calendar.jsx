import { useState, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from "@fullcalendar/core/locales/es"
import TopBar from "../components/layout/TopBar"
import AppointmentModal from "../components/appointments/AppointmentModal"
import { useAppointments } from "../hooks/useAppointments"

const SERVICE_COLORS = {
  "Corte":               "#c9973c",
  "Barba":               "#3d2b1f",
  "Corte y Barba":       "#c0392b",
  "Arreglo de cejas":    "#7c6b5a",
  "Tratamiento capilar": "#2e6b5e",
  default:               "#6b7280",
}

export default function Calendar() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal]         = useState(false)
  const [selectedDate, setSelectedDate]   = useState(null)
  const calRef = useRef(null)

  const { data: appointments = [] } = useAppointments()

  const events = appointments.map(a => ({
    id:    String(a.id),
    title: a.client_name || a.client_phone,
    start: a.start_at,
    end:   a.end_at,
    backgroundColor: SERVICE_COLORS[a.service] || SERVICE_COLORS.default,
    borderColor: "transparent",
    extendedProps: { ...a },
  }))

  return (
    <>
      <TopBar title="Mis Citas" subtitle="Calendario de citas" />
      <div className="p-8">
        <div className="card p-4">
          {/* Leyenda + botón */}
          <div className="flex items-center gap-4 mb-4 px-2 flex-wrap">
            {Object.entries(SERVICE_COLORS)
              .filter(([k]) => k !== "default")
              .map(([service, color]) => (
                <span key={service} className="flex items-center gap-1.5 text-xs font-body text-espresso-800">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  {service}
                </span>
              ))}
            <button
              onClick={() => { setSelectedEvent(null); setSelectedDate(new Date()); setShowModal(true) }}
              className="ml-auto btn-primary"
            >
              + Nueva cita
            </button>
          </div>

          <FullCalendar
            ref={calRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={esLocale}
            headerToolbar={{
              left:   "prev,next today",
              center: "title",
              right:  "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            slotMinTime="08:00:00"
            slotMaxTime="21:00:00"
            slotDuration="00:30:00"
            height="auto"
            eventClick={({ event }) => {
              setSelectedEvent(event.extendedProps)
              setShowModal(true)
            }}
            dateClick={({ date }) => {
              setSelectedEvent(null)
              setSelectedDate(date)
              setShowModal(true)
            }}
            // Mostrar servicio debajo del nombre en la vista de semana
            eventContent={({ event, view }) => (
              <div className="px-1 py-0.5 overflow-hidden">
                <p className="font-medium text-xs leading-tight truncate">{event.title}</p>
                {view.type !== "dayGridMonth" && (
                  <p className="text-xs opacity-80 truncate">{event.extendedProps.service}</p>
                )}
              </div>
            )}
            eventClassNames="cursor-pointer rounded-lg font-body"
          />
        </div>
      </div>

      {showModal && (
        <AppointmentModal
          appointment={selectedEvent}
          defaultDate={selectedDate}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
