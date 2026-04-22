# Camino Real — Panel de Administración

Panel frontend para el servicio de agendamiento de citas por WhatsApp.

## Stack
- React 18 + Vite
- TanStack Query v5
- FullCalendar 6
- Tailwind CSS
- React Router v6
- Axios

## Instalación

```bash
cd admin-panel
npm install
npm run dev
```

> El panel corre en `http://localhost:5173` y hace proxy de `/api` a `http://localhost:3000`
> (donde corre el backend Node.js del proyecto)

## Estructura

```
src/
├── lib/
│   └── api.js              # Cliente Axios + llamadas a endpoints
├── hooks/
│   ├── useAppointments.js  # Queries/mutations de citas
│   └── useBarbers.js       # Queries/mutations de barberos
├── components/
│   ├── layout/
│   │   ├── Layout.jsx      # Shell principal
│   │   ├── Sidebar.jsx     # Navegación lateral
│   │   └── TopBar.jsx      # Barra superior
│   ├── appointments/
│   │   └── AppointmentModal.jsx  # Crear/editar citas
│   ├── barbers/
│   │   ├── BarberModal.jsx       # Crear/editar barbero
│   │   └── ScheduleModal.jsx     # Configurar horarios
│   └── dashboard/
│       └── StatCard.jsx          # Tarjeta de estadísticas
└── pages/
    ├── Dashboard.jsx  # Vista principal con stats y citas de hoy
    ├── Calendar.jsx   # Calendario semanal/mensual con FullCalendar
    └── Barbers.jsx    # Gestión del equipo
```

## Endpoints que consume (backend)
- `GET  /api/appointments`
- `POST /api/appointments`
- `PUT  /api/appointments/:id`
- `DELETE /api/appointments/:id`
- `GET  /api/barbers`
- `POST /api/barbers`
- `PUT  /api/barbers/:id`
- `GET  /api/barbers/:id/schedule`
- `PUT  /api/barbers/:id/schedule`
