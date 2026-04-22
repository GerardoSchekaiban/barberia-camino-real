// webhookController.js
const { handleIncomingMessage } = require("../services/conversationService");

async function handleWebhook(req, res) {
  const { Body, From } = req.body;

  await handleIncomingMessage(From, Body);

  res.sendStatus(200);
}

module.exports = { handleWebhook };