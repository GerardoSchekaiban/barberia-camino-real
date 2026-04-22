import { NavLink } from "react-router-dom";
import { CalendarDays, LayoutDashboard, Clock, Scissors, Users, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/",         icon: LayoutDashboard, label: "Inicio"     },
  { to: "/calendar", icon: CalendarDays,    label: "Mis Citas"  },
  { to: "/barbers",  icon: Users,           label: "Barberos"   },
  { to: "/schedule", icon: Clock,           label: "Mi Horario" },
];

export default function Sidebar() {
  const { barber, logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-espresso-900 flex flex-col">
      <div className="px-6 py-8 border-b border-espresso-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center">
            <Scissors size={18} className="text-espresso-900" />
          </div>
          <div>
            <p className="font-display text-cream-50 font-semibold text-sm leading-tight">Camino Real</p>
            <p className="text-xs text-cream-200 opacity-60 font-body">Panel de barbero</p>
          </div>
        </div>
      </div>

      {barber && (
        <div className="px-6 py-4 border-b border-espresso-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-espresso-700 flex items-center justify-center">
              <span className="font-display text-sm font-semibold text-gold-400">
                {barber.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-cream-50 font-body">{barber.name}</p>
              <p className="text-xs text-cream-200 opacity-50 font-body">@{barber.username}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gold-500 text-espresso-900"
                  : "text-cream-200 opacity-70 hover:opacity-100 hover:bg-espresso-700"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body font-medium text-cream-200 opacity-50 hover:opacity-80 hover:bg-espresso-700 transition"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
