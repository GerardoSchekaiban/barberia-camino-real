const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "camino-real-secret-cambiar-en-prod";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "No autenticado" });

  try {
    req.barber = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = { requireAuth, JWT_SECRET };
