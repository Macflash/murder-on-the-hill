import Peer from 'simple-peer';
import { SignalHost } from './player_api';

/** Connection for the host of a game */
export class HostConnection {
    private socket = new WebSocket('ws://localhost:8081');
    private players = new Map<string, Peer.Instance>();

    private gameCode?: string;
    private resolveOnGameCode?: (gameCode: string) => void;
    private onGameCode = new Promise<string>(resolve => {
        this.resolveOnGameCode = resolve;
    });

    get onAssignedGameCode() {
        return this.onGameCode;
    }

    constructor(
        private onPlayerData: (playerId: string, data: string) => void,
        private log = false,
    ) { }

    get playerIds() {
        return Array.from(this.players.keys());
    }

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
                    this.log && console.log("Assigned a game code", this.gameCode);
                    this.resolveOnGameCode?.(this.gameCode);
                    break;

                case "SignalHost":
                    const signalData = serverData as SignalHost;
                    const { playerId, signal } = signalData;
                    this.log && console.log("Received signal from", playerId, signal);
                    if (!this.players.has(playerId)) {
                        // existing player
                        const peer = new Peer({ trickle: false, });
                        console.log("New player!", playerId, peer);
                        peer.on('readable', () => {
                            console.log("READABLE!");
                        })
                        // set up the event handler for our peer connection 
                        // to send signal data to the other player
                        peer.on('signal', data => {
                            // THIS NEVER FIRES WTF
                            console.log("signal data from host that should go to the remote player");
                            // we need to get this data to the other player
                            this.socket.send(createSignalPlayer(playerId, data));
                        });

                        peer.on('connect', () => {
                            this.onPlayerJoinListeners.forEach(f => f());
                            console.log("Connected to a player successfully!");
                        });

                        peer.on('data', data => {
                            alert("data from player!");
                            this.onPlayerData(playerId, data?.toString());
                        });

                        peer.on('error', e => {
                            console.error("error from player", e);
                        });

                        this.players.set(playerId, peer);
                    }

                    // Pass our peer connection the signal data.
                    const player = this.players.get(playerId);
                    if (!player) { throw new Error("Invalid player! " + playerId); }
                    console.log("gave our player peer object the signal data", signal);
                    player.signal(signal);
                    break;

                default:
                    console.error("unrecognized message from the server!", e.data);
            }
        });
    }

    sendToAllPlayers(data: any) {
        console.log("sending to ", this.players);
        this.players.forEach(peer => {
            console.log(peer);
            peer.send(data);
        });
    }

    private onPlayerJoinListeners: (() => void)[] = [];
    onPlayerJoin(listener: () => void) {
        this.onPlayerJoinListeners.push(listener);
    }
}

export interface WebSocketServerMessage {
    type: "NewGame" | "NewGameResponse" | "SignalHost" | "SignalPlayer",
}

// Sent from the Host to the server to get a GameCode.
export interface NewGameMessage extends WebSocketServerMessage {
    type: "NewGame",
    // No other payload
}

function createNewGameMessage(): string {
    const request: NewGameMessage = { type: "NewGame" };
    return JSON.stringify(request);
}

// Response from the server with the assigned GameCode
export interface NewGameResponse extends WebSocketServerMessage {
    type: "NewGameResponse",
    gameCode: string,
}

// Sent from the Host to the player to connect via WebRTC
// This message is forwared as-is to the player by the server.
export interface SignalPlayer extends WebSocketServerMessage {
    type: "SignalPlayer",
    playerId: string,
    signal: string,
}

function createSignalPlayer(playerId: string, signal: string): string {
    const data: SignalPlayer = {
        type: "SignalPlayer",
        playerId,
        signal
    };
    return JSON.stringify(data);
}
