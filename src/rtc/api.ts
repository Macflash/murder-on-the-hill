export class HostConnection {
    private socket = new WebSocket('ws://localhost:8081');
    private gameCode?: string;

    hostNewGame() {
        // Connection opened
        this.socket.addEventListener('open', e => {
            this.socket.send(createNewGameMessage());
        });

        // Listen for messages
        this.socket.addEventListener('message', e => {
            const serverData = JSON.parse(e.data) as WebSocketServerMessage;
            switch (serverData.type) {
                case "NewGameResponse":
                    this.gameCode = (serverData as NewGameResponse).gameCode;
                    console.log("Assigned a game code", this.gameCode);
                    break;
                default:
                    console.error("unrecognized message from the server!", e.data);
            }
        });
    }

    connectToGame(gameCode: string) {
        this.gameCode = gameCode;

    }
}

function createNewGameMessage(): string {
    return JSON.stringify({ type: "NewGame" } as NewGameMessage);
}

export interface WebSocketServerMessage {
    type: "NewGame" | "NewGameResponse" | "SignalHost" | "SignalPlayer",
}

export interface NewGameMessage extends WebSocketServerMessage {
    type: "NewGame",
}

export interface NewGameResponse extends WebSocketServerMessage {
    type: "NewGameResponse",
    gameCode: string,
}

export interface SignalHost extends WebSocketServerMessage {
    type: "SignalHost",
    gameCode: string,
    signal: string,
}