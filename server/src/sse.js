// server/src/sse.js
let clients = [];

function streamHandler(req, res, next) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const client = { id: Date.now(), res };
  clients.push(client);

  req.on("close", () => {
    clients = clients.filter(c => c.id !== client.id);
  });
}

function broadcast(payload) {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(payload)}\n\n`);
  });
}

module.exports = {
  streamHandler,
  broadcast,
};
