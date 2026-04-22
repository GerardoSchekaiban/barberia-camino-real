DELETE FROM conversations;

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS history JSONB DEFAULT '[]';

ALTER TABLE conversations
  DROP COLUMN IF EXISTS step,
  DROP COLUMN IF EXISTS service,
  DROP COLUMN IF EXISTS barber_id,
  DROP COLUMN IF EXISTS client_name,
  DROP COLUMN IF EXISTS selected_date,
  DROP COLUMN IF EXISTS selected_time,
  DROP COLUMN IF EXISTS slots,
  DROP COLUMN IF EXISTS available_days;