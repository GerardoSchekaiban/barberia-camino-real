const express = require("express");
const router  = express.Router();

const { handleIncomingMessage } = require("../services/conversationService");

// GET /webhook — Verificación inicial de Meta
router.get("/", (req, res) => {
  const mode      = req.query["hub.mode"];
  const token     = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    console.log("✅ Webhook verificado por Meta");
    return res.status(200).send(challenge);
  }

  console.warn("❌ Token de verificación incorrecto");
  return res.sendStatus(403);
});

// POST /webhook — Mensajes entrantes de Meta
router.post("/", async (req, res) => {
  res.sendStatus(200);

  try {
    const entry   = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value   = changes?.value;

    // Ignorar notificaciones que no sean mensajes
    if (!value?.messages) return;

    const msg   = value.messages[0];
    const phone = msg.from;
    const text  = msg.text?.body;

    if (!text) return;

    // Ignorar mensajes enviados por el propio número del negocio
    const businessPhone = value.metadata?.phone_number_id;
    const displayPhone  = value.metadata?.display_phone_number?.replace(/\D/g, "");
    if (phone === displayPhone) {
      console.log("📤 Mensaje propio ignorado");
      return;
    }

    console.log(`📩 Mensaje de ${phone}: ${text}`);

    await handleIncomingMessage(phone, text);
  } catch (err) {
    console.error("Error procesando mensaje:", err.message);
  }
});

module.exports = router;