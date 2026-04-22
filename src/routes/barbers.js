const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db     = require("../config/db");
const { requireAuth } = require("../middleware/auth");

// GET /api/barbers — público (el bot lo usa)
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, phone, username FROM barbers ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/barbers — crear barbero con credenciales
router.post("/", async (req, res) => {
  const { name, phone, username, password } = req.body;
  if (!name || !username || !password)
    return res.status(400).json({ error: "name, username y password son requeridos" });

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO barbers (name, phone, username, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, phone, username`,
      [name, phone || null, username, password_hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ error: "El username ya existe" });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/barbers/:id — editar barbero (nombre, teléfono, usuario, contraseña)
router.put("/:id", async (req, res) => {
  const { name, phone, username, password } = req.body;
  const fields = [], values = [];
  let idx = 1;

  if (name)     { fields.push(`name = $${idx++}`);     values.push(name); }
  if (phone)    { fields.push(`phone = $${idx++}`);    values.push(phone); }
  if (username) { fields.push(`username = $${idx++}`); values.push(username); }
  if (password) {
    fields.push(`password_hash = $${idx++}`);
    values.push(await bcrypt.hash(password, 10));
  }

  if (!fields.length)
    return res.status(400).json({ error: "Nada que actualizar" });

  values.push(req.params.id);
  try {
    const result = await db.query(
      `UPDATE barbers SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, name, phone, username`,
      values
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Barbero no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ error: "El username ya existe" });
    res.status(500).json({ error: err.message });
  }
});

// GET /api/barbers/:id/schedule — solo el propio barbero
router.get("/:id/schedule", requireAuth, async (req, res) => {
  if (Number(req.params.id) !== req.barber.id)
    return res.status(403).json({ error: "No autorizado" });

  try {
    const result = await db.query(
      "SELECT * FROM barber_availability WHERE barber_id = $1 ORDER BY day_of_week",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/barbers/:id/schedule — solo el propio barbero
router.put("/:id/schedule", requireAuth, async (req, res) => {
  if (Number(req.params.id) !== req.barber.id)
    return res.status(403).json({ error: "No autorizado" });

  const schedule = req.body;
  console.log("Schedule recibido:", JSON.stringify(schedule));

  if (!Array.isArray(schedule))
    return res.status(400).json({ error: "Se espera un array de horarios" });

  try {
    await db.query("DELETE FROM barber_availability WHERE barber_id = $1", [req.params.id]);
    for (const day of schedule) {
      await db.query(
        `INSERT INTO barber_availability (barber_id, day_of_week, start_time, end_time, lunch_start, lunch_end)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          req.params.id,
          day.day_of_week,
          day.start_time,
          day.end_time,
          day.lunch_start || null,
          day.lunch_end   || null,
        ]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Error guardando horario:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;