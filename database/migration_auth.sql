-- ─────────────────────────────────────────────
-- MIGRATION: Autenticación por barbero
-- Ejecutar UNA sola vez en tu base de datos:
--   psql -U gerardo -d peluqueria_camino_real -f database/migration_auth.sql
-- ─────────────────────────────────────────────

ALTER TABLE barbers
  ADD COLUMN IF NOT EXISTS username      TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS phone         TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_barbers_username ON barbers(username);
