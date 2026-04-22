const router = require("express").Router();
const db     = require("../config/db");
const { requireAuth } = require("../middleware/auth");
const { getDuration } = require("../lib/serviceDuration");

router.use(requireAuth);

// GET /api/appointments
router.get("/", async (req, res) => {
  try {
    let query  = `SELECT a.*, b.name AS barber_name
                  FROM appointments a
                  JOIN barbers b ON b.id = a.barber_id
                  WHERE a.barber_id = $1`;
    const params = [req.barber.id];

    if (req.query.date) {
      query += ` AND a.start_at::date = $2`;
      params.push(req.query.date);
    }

    query += ` ORDER BY a.start_at`;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/appointments
router.post("/", async (req, res) => {
  const { client_name, client_phone, service, start_at } = req.body;
  if (!client_name || !client_phone || !service || !start_at)
    return res.status(400).json({ error: "client_name, client_phone, service y start_at son requeridos" });

  try {
    const startDate = new Date(start_at);
    const endDate   = new Date(startDate.getTime() + getDuration(service));

    const result = await db.query(
      `INSERT INTO appointments (barber_id, client_name, client_phone, service, start_at, end_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.barber.id, client_name, client_phone, service, startDate, endDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/appointments/:id
router.put("/:id", async (req, res) => {
  const { client_name, client_phone, service, start_at, status } = req.body;

  try {
    const check = await db.query(
      "SELECT id, service, start_at FROM appointments WHERE id = $1 AND barber_id = $2",
      [req.params.id, req.barber.id]
    );
    if (!check.rows[0]) return res.status(404).json({ error: "Cita no encontrada" });

    const fields = [], values = [];
    let idx = 1;

    if (client_name)  { fields.push(`client_name = $${idx++}`);  values.push(client_name); }
    if (client_phone) { fields.push(`client_phone = $${idx++}`); values.push(client_phone); }
    if (service)      { fields.push(`service = $${idx++}`);      values.push(service); }
    if (status)       { fields.push(`status = $${idx++}`);       values.push(status); }
    if (start_at) {
      const svc = service || check.rows[0].service;
      const s   = new Date(start_at);
      const e   = new Date(s.getTime() + getDuration(svc));
      fields.push(`start_at = $${idx++}`, `end_at = $${idx++}`);
      values.push(s, e);
    }

    if (!fields.length) return res.status(400).json({ error: "Nada que actualizar" });

    values.push(req.params.id);
    const result = await db.query(
      `UPDATE appointments SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/appointments/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM appointments WHERE id = $1 AND barber_id = $2 RETURNING id",
      [req.params.id, req.barber.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Cita no encontrada" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
