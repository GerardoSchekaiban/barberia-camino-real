const db = require("../config/db");
const { getDuration } = require("../lib/serviceDuration");

async function createAppointment(data) {
  const formattedDate = data.date.toString().slice(0, 10);
  const timeParts     = data.time.toString().slice(0, 5);

  // Construir timestamp en hora local sin conversión UTC
  const startStr = `${formattedDate} ${timeParts}:00`;
  const durationMs = getDuration(data.service);
  const durationMin = durationMs / 60000;

  // Calcular end_at sumando minutos directamente
  const [h, m] = timeParts.split(":").map(Number);
  const totalMin = h * 60 + m + durationMin;
  const endH = String(Math.floor(totalMin / 60)).padStart(2, "0");
  const endM = String(totalMin % 60).padStart(2, "0");
  const endStr = `${formattedDate} ${endH}:${endM}:00`;

  await db.query(
    `INSERT INTO appointments (barber_id, client_name, client_phone, service, start_at, end_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [data.barber_id, data.client_name || null, data.phone, data.service, startStr, endStr]
  );
}

module.exports = { createAppointment };