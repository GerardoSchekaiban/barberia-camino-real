const axios = require("axios");

async function sendMessage(to, body) {
  // En modo prueba solo imprimimos el mensaje en consola
  if (process.env.TEST_MODE === "true") {
    console.log(`\n📩 [TEST] Para: ${to}`);
    console.log(`💬 Mensaje: ${body}\n`);
    return;
  }

  const phone = to.replace("whatsapp:", "").replace("+", "");

  console.log(`📤 Enviando mensaje a ${phone}`);

  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(`✅ Mensaje enviado a ${phone}`);
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendMessage };