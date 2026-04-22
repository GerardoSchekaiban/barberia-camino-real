const db = require("../config/db");

async function getHistory(phone) {
  const res = await db.query("SELECT history FROM conversations WHERE phone = $1", [phone]);
  if (!res.rows[0] || !res.rows[0].history) return [];
  const h = res.rows[0].history;
  return typeof h === "string" ? JSON.parse(h) : h;
}

async function appendMessage(phone, role, content) {
  const history = await getHistory(phone);
  history.push({ role, content });

  await db.query(
    `INSERT INTO conversations (phone, history)
     VALUES ($1, $2)
     ON CONFLICT (phone) DO UPDATE SET history = $2`,
    [phone, JSON.stringify(history)]
  );
}

async function resetConversation(phone) {
  await db.query("DELETE FROM conversations WHERE phone = $1", [phone]);
}

module.exports = { getHistory, appendMessage, resetConversation };