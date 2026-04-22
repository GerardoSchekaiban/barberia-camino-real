import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useCreateBarber, useUpdateBarber } from "../../hooks/useBarbers";

export default function BarberModal({ barber, onClose }) {
  const isEdit = !!barber;
  const [form, setForm] = useState({
    name:     barber?.name     ?? "",
    phone:    barber?.phone    ?? "",
    username: barber?.username ?? "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);

  const create  = useCreateBarber();
  const update  = useUpdateBarber();
  const loading = create.isPending || update.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    // Al editar, solo mandar password si se escribió algo
    if (isEdit && !payload.password) delete payload.password;

    if (isEdit) {
      await update.mutateAsync({ id: barber.id, ...payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="font-display text-base font-semibold text-espresso-900">
            {isEdit ? "Editar barbero" : "Nuevo barbero"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-cream-100 rounded-lg transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Datos generales */}
          <div>
            <label className="label">Nombre</label>
            <input className="input" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Teléfono (opcional)</label>
            <input className="input" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>

          {/* Credenciales */}
          <div className="border-t border-cream-100 pt-4">
            <p className="text-xs text-espresso-700 opacity-50 font-body mb-3 uppercase tracking-wide">
              Credenciales de acceso al panel
            </p>
            <div className="space-y-3">
              <div>
                <label className="label">Usuario</label>
                <input
                  className="input"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="ej. juan_barbero"
                  required={!isEdit}
                />
              </div>
              <div>
                <label className="label">
                  {isEdit ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
                </label>
                <div className="relative">
                  <input
                    className="input pr-10"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder={isEdit ? "••••••••" : "mínimo 6 caracteres"}
                    minLength={isEdit ? undefined : 6}
                    required={!isEdit}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-700 opacity-40 hover:opacity-70 transition"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Guardando..." : isEdit ? "Guardar" : "Crear barbero"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
