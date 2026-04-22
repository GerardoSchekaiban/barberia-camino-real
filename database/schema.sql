-- Barberos
CREATE TABLE barbers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Horarios de trabajo por barbero
CREATE TABLE barber_availability (
  id SERIAL PRIMARY KEY,
  barber_id INT REFERENCES barbers(id),
  day_of_week INT, -- 0=Domingo, 6=Sábado
  start_time TIME,
  end_time TIME
);

-- Citas
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  barber_id INT REFERENCES barbers(id),
  client_phone TEXT,
  service TEXT,
  start_at TIMESTAMP,
  end_at TIMESTAMP,
  status TEXT DEFAULT 'CONFIRMED'
);

-- Conversaciones
CREATE TABLE conversations (
  phone TEXT PRIMARY KEY,
  step TEXT,
  service TEXT,
  barber_id INT,
  selected_date DATE,
  selected_time TIME,
  slots JSONB
);