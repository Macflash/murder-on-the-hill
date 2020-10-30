import { timingSafeEqual } from 'crypto';
import Peer from 'simple-peer';
import { SignalPlayer } from './host_api';

/** Connection for a player who joins a game. */
export class PlayerConnection {
    // A socket to the signalling server
    private socket = new WebSocket('ws://localhost:8081');

    // A connection to the host
    private host = new Peer({ initiator: true, trickle: false, });

    private gameCode?: string;
    private playerId?: string;
    private resolveOnPlayerId?: (playerId: string) => void;
    private onPlayerId = new Promise<string>(resolve => {
        this.resolveOnPlayerId = resolve;
    });

    constructor(private onHostData: (data: any) => void){}

    get onAssignedPlayerId() {
        return this.onPlayerId;
    }

    sendToHost(data: any){
        this.host.send(data);
    }

    joinGame(gameCode: string) {
        this.gameCode = gameCode;
        // Connection opened
        this.socket.addEventListener('open', e => {
            this.socket.send(createNewPlayer(this.gameCode!));
        });

        // Listen for messages
        this.socket.addEventListener('message', e => {
            const serverData = JSON.parse(e.data) as WebSocketServerMessage;
            switch (serverData.type) {
                case "NewPlayerResponse":
                    console.log("Received NewPlayerResponse from server");
                    const newPlayerResponseData = (serverData as NewPlayerResponse);
                    this.playerId = newPlayerResponseData.playerId;
                    console.log("Assigned a player Id", this.playerId);
                    this.resolveOnPlayerId?.(this.playerId);
                    this.initializeHostConnetion();
                    break;

                case "SignalPlayer":
                    console.log("Received SignalPlayer from server");
                    const signalPlayerData = (serverData as SignalPlayer);
                    // Pass the data to our connection object
                    this.host.signal(signalPlayerData.signal);
                    break;

                default:
                    console.error("unrecognized message from the server!", e.data);
            }
        });
    }

    // Signal the host to establish the WebRTC connection
    private initializeHostConnetion() {
        this.host.on('signal', data => {
            if (!this.playerId) { throw new Error("Can't signal host without a player id!"); }
            if (!this.gameCode) { throw new Error("Can't signal host without a game code!"); }
            this.socket.send(createSignalHost(this.playerId, this.gameCode, data));
        });

        this.host.on('connect', () => {
            console.log("Connected to the Host!");
        });

        this.host.on('data', data => {
            this.onHostData(data.toString());
        });

        this.host.on('error', e => {
            console.error("error from host", e);
        });
    }
}

export interface WebSocketServerMessage {
    type: "NewPlayer" | "NewPlayerResponse" | "SignalHost" | "SignalPlayer",
}

// Sent by a player trying to join the game specified in gameCode.
export interface NewPlayer extends WebSocketServerMessage {
    type: "NewPlayer",
    gameCode: string,
}

function createNewPlayer(gameCode: string): string {
    const request: NewPlayer = { type: "NewPlayer", gameCode };
    return JSON.stringify(request);
}

// Response from the server providing the player with their playerId.
export interface NewPlayerResponse extends WebSocketServerMessage {
    type: "NewPlayerResponse",
    playerId: string,
}

// Sent by the player to connect to the Host via WebRTC.
// This same message is forwarded as-is to the Host from the server.
export interface SignalHost extends WebSocketServerMessage {
    type: "SignalHost",
    gameCode: string,
    playerId: string,
    signal: string,
}

function createSignalHost(playerId: string, gameCode: string, signal: string): string {
    const request: SignalHost = {
        type: "SignalHost",
        playerId,
        gameCode, // technically this is redundant, but probably an ok sanity check
        signal,
    };
    return JSON.stringify(request);
}