import { Bell } from 'lucide-react'

export default function TopBar({ title, subtitle }) {
  return (
    <header className="h-16 bg-white border-b border-cream-200 px-8 flex items-center justify-between">
      <div>
        <h1 className="font-display text-xl font-semibold text-espresso-900">{title}</h1>
        {subtitle && <p className="text-xs text-espresso-700 opacity-60 font-body mt-0.5">{subtitle}</p>}
      </div>
      <button className="relative p-2 hover:bg-cream-100 rounded-lg transition">
        <Bell size={18} className="text-espresso-800 opacity-70" />
      </button>
    </header>
  )
}
