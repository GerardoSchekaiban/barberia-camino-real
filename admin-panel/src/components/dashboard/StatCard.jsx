export default function StatCard({ icon: Icon, label, value, color = 'gold' }) {
  const colors = {
    gold:    'bg-gold-400/10 text-gold-600',
    espresso:'bg-espresso-800/10 text-espresso-800',
    green:   'bg-emerald-100 text-emerald-700',
    red:     'bg-red-100 text-red-600',
  }
  return (
    <div className="card p-6 flex items-center gap-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide font-medium text-espresso-700 opacity-60 font-body">{label}</p>
        <p className="font-display text-2xl font-semibold text-espresso-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}
