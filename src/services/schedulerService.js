const db = require("../config/db");
const { getAvailability } = require("../models/barberModel");
const { SERVICE_DURATION } = require("../lib/serviceDuration");

function generateSlots(start, end, durationMinutes = 30, lunchStart = null, lunchEnd = null) {
  const slots    = [];
  let current    = new Date(`1970-01-01T${start}`);
  const endTime  = new Date(`1970-01-01T${end}`);
  const lunchS   = lunchStart ? new Date(`1970-01-01T${lunchStart.slice(0,5)}`) : null;
  const lunchE   = lunchEnd   ? new Date(`1970-01-01T${lunchEnd.slice(0,5)}`)   : null;

  while (current < endTime) {
    const slotEnd = new Date(current.getTime() + durationMinutes * 60000);

    if (slotEnd > endTime || current >= endTime) break;

    // Excluir slots que se traslapen con el horario de comida
    const duringLunch = lunchS && lunchE &&
      current < lunchE && slotEnd > lunchS;

    if (!duringLunch) {
      slots.push({
        start: current.toTimeString().slice(0, 5),
        end:   slotEnd.toTimeString().slice(0, 5),
      });
    }

    current = new Date(current.getTime() + 30 * 60000);
  }

  return slots;
}

async function getAvailableSlots(barber_id, date, service = null, limit = null) {
  const day = new Date(date + "T12:00:00").getDay();

  const availability = await getAvailability(barber_id, day);
  if (!availability) return [];

  const durationMinutes = service
    ? (SERVICE_DURATION[service] ?? 30)
    : 30;

  
  const allSlots = generateSlots(
    availability.start_time,
    availability.end_time,
    durationMinutes,
    availability.lunch_start || null,
    availability.lunch_end   || null
  );


  const res = await db.query(
    `SELECT start_at, end_at FROM appointments
     WHERE barber_id = $1 AND DATE(start_at) = $2 AND status != 'CANCELLED'`,
    [barber_id, date]
  );

  const bookedRanges = res.rows.map(r => ({
    start: r.start_at.toTimeString
      ? r.start_at.toTimeString().slice(0, 5)
      : String(r.start_at).slice(11, 16),
    end: r.end_at.toTimeString
      ? r.end_at.toTimeString().slice(0, 5)
      : String(r.end_at).slice(11, 16),
  }));

  const todayCST = new Date().toLocaleDateString("en-CA", { timeZone: "America/Monterrey" });
  const isToday  = date === todayCST;
  const nowCST   = isToday
    ? new Date().toLocaleTimeString("en-GB", { timeZone: "America/Monterrey", hour: "2-digit", minute: "2-digit" })
    : "00:00";

  let available = allSlots.filter(slot => {
    if (isToday && slot.start <= nowCST) return false;

    const slotEndDate = new Date(`1970-01-01T${slot.start}`);
    slotEndDate.setMinutes(slotEndDate.getMinutes() + durationMinutes);
    const slotEndStr = slotEndDate.toTimeString().slice(0, 5);

    return !bookedRanges.some(booked =>
      slot.start < booked.end && slotEndStr > booked.start
    );
  });

  if (limit) available = available.slice(0, limit);

  return available;
}

module.exports = { getAvailableSlots };