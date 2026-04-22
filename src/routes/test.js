const express = require("express");
const router = express.Router();

const { handleIncomingMessage } = require("../services/conversationService");

// POST /test
// Body: { "phone": "5211234567890", "message": "hola" }
router.post("/", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: "Se requieren phone y message" });
  }

  try {
    await handleIncomingMessage(phone, message);
    res.json({ ok: true, phone, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;