-- Ejecutar UNA sola vez:
-- psql -U gerardo -d peluqueria_camino_real -f database/migration_client_name.sql

-- Agregar nombre del cliente a las citas
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS client_name TEXT;

-- Agregar nombre del cliente al estado de conversación WhatsApp
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS client_name TEXT;
