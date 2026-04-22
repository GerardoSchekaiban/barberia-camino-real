const Anthropic = require("@anthropic-ai/sdk");
const { getAvailableSlots } = require("./schedulerService");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getNextWorkingDays() {
  const days = [];
  const date  = new Date();

  while (days.length < 7) {
    if (date.getDay() !== 0) {
      days.push(date.toLocaleDateString("en-CA", { timeZone: "America/Monterrey" }));
    }
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function formatDateSpanish(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long"
  });
}

async function buildAvailabilityContext(barber_id) {
  const days  = getNextWorkingDays();
  const lines = [];
  const todayCST = new Date().toLocaleDateString("en-CA", { timeZone: "America/Monterrey" });

  for (const date of days) {
    const isToday = date === todayCST;
    const slots   = await getAvailableSlots(barber_id, date, "Corte", isToday ? 5 : null);

    if (slots.length > 0) {
      const times = slots.map(s => s.start).join(", ");
      lines.push(`${formatDateSpanish(date)} (${date}): ${times}`);
    } else {
      lines.push(`${formatDateSpanish(date)} (${date}): sin disponibilidad`);
    }
  }

  return lines.join("\n");
}

function trimHistory(history, maxMessages = 10) {
  if (history.length <= maxMessages) return history;
  return history.slice(history.length - maxMessages);
}

async function getAIResponse(barber_id, barberName, history) {
  const availability = await buildAvailabilityContext(barber_id);

  const today = new Date().toLocaleDateString("es-MX", {
    timeZone: "America/Monterrey",
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const systemPrompt = `Eres el asistente virtual de Barbería Camino Real. Tu único trabajo es agendar citas para el barbero ${barberName}.

HOY ES: ${today}

SERVICIOS DISPONIBLES:
- Corte
- Barba
- Corte + Barba
- Arreglo de cejas
- Tratamiento capilar

DISPONIBILIDAD ACTUAL DE ${barberName.toUpperCase()} (próximos horarios libres):
${availability}

INSTRUCCIONES ESTRICTAS:
1. SALUDO: Solo responde con el mensaje de bienvenida si el cliente únicamente mandó un saludo sin ninguna otra información. Si el mensaje incluye intención de agendar u otro detalle, ve directo al punto sin saludar primero. Cuando aplique, el mensaje de bienvenida es exactamente: "¡Hola! 👋 Bienvenido a Barbería Camino Real. Soy el asistente de ${barberName}. A tus órdenes."

2. NATURALIDAD: No repitas ni confirmes en voz alta lo que el cliente ya dijo. No digas cosas como "Entiendo que quieres un corte para hoy". Ve directo a lo que necesitas o a ofrecer opciones.

3. DISPONIBILIDAD: La lista de disponibilidad es la ÚNICA fuente de verdad. ÚNICAMENTE puedes ofrecer horarios que aparezcan EXACTAMENTE en esa lista. Si el cliente pide las 14:00 y no aparece en la lista, NO está disponible. Nunca ofrezcas un horario que no esté en la lista. Muestra máximo 5 horarios cuando ofrezcas opciones, no listes todos.

4. HORARIO NO DISPONIBLE: Si el cliente pide una hora que no está en la lista, ofrece otros horarios de ESE MISMO DÍA. Solo sugiere otro día si ese día no tiene ningún horario disponible.

5. CONFIRMACIÓN: Antes de agendar, pide siempre confirmación al cliente de forma breve. Ejemplo: "¿Te confirmo la cita?" Solo agenda (devuelve appointment) cuando el cliente confirme explícitamente.

6. RESUMEN: Menciona el resumen de la cita (nombre, servicio, fecha, hora) solo al pedir confirmación y en el mensaje final. No incluyas la duración del servicio en ningún mensaje.

7. FORMATO: Responde SIEMPRE en este JSON exacto sin texto extra:
{"message": "tu respuesta", "appointment": null}

Cuando el cliente confirme y tengas todos los datos:
{"message": "✅ mensaje de confirmación final", "appointment": {"client_name": "nombre", "service": "servicio", "date": "YYYY-MM-DD", "time": "HH:MM"}}`;

  const response = await client.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system:     systemPrompt,
    messages:   trimHistory(history, 10),
  });

  const raw = response.content[0].text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  try {
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { message: raw, appointment: null };
  } catch {
    return { message: raw, appointment: null };
  }
}

module.exports = { getAIResponse };