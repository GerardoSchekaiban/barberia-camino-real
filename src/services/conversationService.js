const { getHistory, appendMessage, resetConversation } = require("../models/conversationModel");
const { getAIResponse } = require("./aiService");
const { createAppointment } = require("../models/appointmentModel");
const { sendMessage } = require("./whatsappService");
const db = require("../config/db");

async function getBarberById(barber_id) {
  const res = await db.query("SELECT * FROM barbers WHERE id = $1", [barber_id]);
  return res.rows[0];
}

async function handleIncomingMessage(phone, message, barber_id) {
  const assignedBarberId = barber_id || parseInt(process.env.TEST_BARBER_ID) || 1;

  const barber = await getBarberById(assignedBarberId);
  if (!barber) {
    return sendMessage(phone, "Lo sentimos, servicio no disponible en este momento.");
  }

  await appendMessage(phone, "user", message);
  const history = await getHistory(phone);

  try {
    const result = await getAIResponse(assignedBarberId, barber.name, history);

    await appendMessage(phone, "assistant", result.message);

    if (result.appointment) {
      try {
        await createAppointment({
          phone,
          client_name: result.appointment.client_name,
          barber_id:   assignedBarberId,
          service:     result.appointment.service,
          date:        result.appointment.date,
          time:        result.appointment.time,
        });
        await resetConversation(phone);
        return sendMessage(phone, result.message);
      } catch (err) {
        console.error("Error creando cita:", err.message);
        return sendMessage(phone, "Hubo un error al guardar tu cita. Por favor intenta de nuevo.");
      }
    }
    
    return sendMessage(phone, result.message);

  } catch (err) {
    console.error("Error llamando a Claude:", err.message);
    return sendMessage(phone, "Lo sentimos, hubo un error. Intenta de nuevo en un momento.");
  }
}

module.exports = { handleIncomingMessage };