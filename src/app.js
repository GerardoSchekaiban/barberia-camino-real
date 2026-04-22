require("dotenv").config();

const express    = require("express");
const bodyParser = require("body-parser");
const path       = require("path");

const webhookRoutes     = require("./routes/webhook");
const testRoutes        = require("./routes/test");
const authRoutes        = require("./routes/auth");
const barbersRoutes     = require("./routes/barbers");
const appointmentsRoutes = require("./routes/appointments");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ── API ──────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/barbers",      barbersRoutes);
app.use("/api/appointments", appointmentsRoutes);

// ── WhatsApp Webhook ─────────────────────────
app.use("/webhook", webhookRoutes);

// ── Modo prueba ──────────────────────────────
if (process.env.TEST_MODE === "true") {
  app.use("/test", testRoutes);
  console.log("🧪 Modo prueba activado en /test");
}

// ── Panel de administración (React build) ────
// Sirve el build de admin-panel/dist en producción
const adminDist = path.join(__dirname, "../admin-panel/dist");
app.use("/panel", express.static(adminDist));
app.get("/panel/*path", (req, res) => {
  res.sendFile(path.join(adminDist, "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
  console.log(`📋 Panel de admin: http://localhost:${process.env.PORT || 3000}/panel`);
});
