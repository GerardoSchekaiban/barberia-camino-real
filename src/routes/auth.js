const router  = require("express").Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const db      = require("../config/db");
const { JWT_SECRET } = require("../middleware/auth");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username y password son requeridos" });

  try {
    const result = await db.query(
      "SELECT id, name, username, password_hash FROM barbers WHERE username = $1",
      [username]
    );
    const barber = result.rows[0];

    if (!barber || !barber.password_hash)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    const valid = await bcrypt.compare(password, barber.password_hash);
    if (!valid)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: barber.id, name: barber.name, username: barber.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, barber: { id: barber.id, name: barber.name, username: barber.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
const { requireAuth } = require("../middleware/auth");
router.get("/me", requireAuth, (req, res) => {
  res.json({ barber: req.barber });
});

module.exports = router;
