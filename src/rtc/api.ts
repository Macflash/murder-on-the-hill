import Peer from 'simple-peer';

export class HostConnection {
    private socket = new WebSocket('ws://localhost:8081');
    private gameCode?: string;
    private players = new Map<string, Peer.Instance>();

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

                case "SignalHost":
                    const signalData = serverData as SignalHost;
                    const { playerId, signal } = signalData;
                    console.log("Received signal from", playerId);
                    if (!this.players.has(playerId)) {
                        // existing player
                        console.log("New player!");
                        const peer = new Peer();
                        this.players.set(playerId, peer);

                        // set up the event handler for our peer connection 
                        // to send signal data to the other player
                        peer.on('signal', data => {
                            console.log("signal data", data);
                            // we need to get this data to the other player
                            this.socket.send(createSignalPlayer(playerId, data));
                        });
                    }

                    // Pass our peer connection the signal data.
                    this.players.get(playerId)?.signal(signal);
                    break;
                    
                default:
                    console.error("unrecognized message from the server!", e.data);
            }
        });
    }
}

function createNewGameMessage(): string {
    const request: NewGameMessage = { type: "NewGame" };
    return JSON.stringify(request);
}

function createSignalPlayer(playerId: string, signal: string): string {
    const data: SignalPlayer = {
        type: "SignalPlayer",
        playerId,
        signal
    }
    return JSON.stringify(data);
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

export interface SignalPlayer extends WebSocketServerMessage {
    type: "SignalPlayer",
    playerId: string,
    signal: string,
}

export interface SignalHost extends WebSocketServerMessage {
    type: "SignalHost",
    gameCode: string,
    playerId: string,
    signal: string,
}