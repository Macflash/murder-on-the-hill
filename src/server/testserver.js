const WebSocket = require('ws');

/** @type {Map<string:WebSocket>} */
const Hosts = new Map();

/** @type {Map<string:WebSocket>} */
const Players = new Map();

console.log("starting...");
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log("New connection.");

  let isNew = true;
  let isHost = false;
  let isPlayer = false;
  let gameCode;
  let playerCode;

  ws.on('message', (message) => {
    isNew = false;
    const clientData = JSON.parse(message);
    switch (clientData.type) {
      case "NewGame":
        console.log("Server got NewGame request");
        isHost = true;

        // Create a new gameCode like XYZBE
        gameCode = createCode();
        while (Hosts.has(gameCode)) {
          gameCode = createCode();
        }

        ws.send(JSON.stringify({
          type: "NewGameResponse",
          gameCode,
        }));
        Hosts.set(gameCode, ws);
        break;

      case "SignalHost":

      default:
        console.error("unrecognized message from the client!", message);
    }
  });

  ws.on('close', () => {
    if(isHost){
      Hosts.delete(gameCode);
    }
  });

  ws.on('error', () => { });

  //ws.send('something');
});

function randomChar() {
  return Math.random() * 25 + 65;
}

function createCode() {
  return String.fromCharCode(
    randomChar(),
    randomChar(),
    randomChar(),
    randomChar(),
    randomChar(),
  );
}