const db = require("../config/db");

async function getBarbers() {
  const res = await db.query("SELECT * FROM barbers");
  return res.rows;
}

async function getAvailability(barber_id, day) {
  const res = await db.query(
    `SELECT * FROM barber_availability
     WHERE barber_id = $1 AND day_of_week = $2`,
    [barber_id, day]
  );
  return res.rows[0];
}

module.exports = { getBarbers, getAvailability };