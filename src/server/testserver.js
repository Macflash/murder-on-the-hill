const WebSocket = require('ws');

/** @type {Map<string:WebSocket>} */
const Hosts = new Map();

/** @type {Map<string:WebSocket>} */
const Players = new Map();

console.log("starting...");
const wsServer = new WebSocket.Server({ port: 8081 });

wsServer.on('connection', (ws) => {
  console.log("New connection.");

  let isNew = true;
  let isHost = false;
  let isPlayer = false;
  let gameCode;
  let playerId;

  ws.on('message', (message) => {
    isNew = false;
    const clientData = JSON.parse(message);
    switch (clientData.type) {
      case "NewGame":
        console.log("Server got NewGame request");
        isHost = true;

        // Create a new gameCode like XYZBE
        gameCode = createGameCode();
        while (Hosts.has(gameCode)) {
          gameCode = createGameCode();
        }

        ws.send(JSON.stringify({
          type: "NewGameResponse",
          gameCode,
        }));
        Hosts.set(gameCode, ws);
        break;

      case "NewPlayer":
        console.log("Server got NewPlayer request");
        if (isHost) { throw new Error("Host should't send NewPlayer requests!"); }
        if (isPlayer || playerId) { throw new Error("Player should already be connected, shouldnt need multiple NEW PLAYER requests."); }
        isHost = false;
        isPlayer = true;
        gameCode = clientData.gameCode;
        if (!gameCode) { throw new Error("Invalid game code in NewPlayer:" + gameCode) }

        playerId = createPlayerId();
        while (Players.has(playerId)) {
          playerId = createPlayerId();
        }

        ws.send(JSON.stringify({
          type: "NewPlayerResponse",
          playerId,
        }));
        Players.set(playerId, ws);
        break;

      case "SignalHost":
        console.log("Server got SignalHost request");
        if (!isPlayer) { throw new Error("Only players can call SignalHost!"); }
        if (playerId !== clientData.playerId) { throw new Error("Player id mismatch in Signal Host!"); }

        // get the host 
        const host = Hosts.get(gameCode);
        if (!host) { throw new Error("invalid game code:" + gameCode) }

        // We don't really care what this is, as long as the client contracts agree.
        host.send(message);
        break;

      case "SignalPlayer":
        console.log("Server got SignalPlayer request");
        if (!isHost) { throw new Error("Only hosts can call SignalHost!"); }

        // Need to parse to know which player should get the message
        const targetPlayerId = clientData.playerId;

        // get the host 
        const player = Players.get(targetPlayerId);
        if (!player) { throw new Error("invalid player id") }

        // Other than the player Id, we don't care what the message was as long as the client contracts agree.
        player.send(message);
        break;

      default:
        console.error("unrecognized message from the client!", message);
    }
  });

  ws.on('close', () => {
    // TODO: We can also delete any connection after say 30 minutes.
    // Player connections should likely be open for 1-5 minutes MAX.
    if (isHost) {
      Hosts.delete(gameCode);
    }
    if (isPlayer) {
      Players.delete(playerId);
    }
  });

  ws.on('error', (errorWs, error) => {
    console.error("error in websocket", error);
  });
});

// Create a random upper case letter
function randomUpperChar() {
  return Math.random() * 25 + 65;
}

// 6 character game code
function createGameCode() {
  return String.fromCharCode(
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
  );
}

// 12 character player code
function createPlayerId() {
  return String.fromCharCode(
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
    randomUpperChar(),
  );
}