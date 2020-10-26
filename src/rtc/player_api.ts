import { timingSafeEqual } from 'crypto';
import Peer from 'simple-peer';
import { SignalPlayer } from './host_api';

/** Connection for a player who joins a game. */
export class PlayerConnection {
    // A socket to the signalling server
    private socket = new WebSocket('ws://localhost:8081');

    // A connection to the host
    private host = new Peer({ initiator: true });

    private gameCode?: string;
    private playerId?: string;
    private resolveOnPlayerId?: (playerId: string) => void;
    private onPlayerId = new Promise<string>(resolve => {
        this.resolveOnPlayerId = resolve;
    });

    get onAssignedPlayerId() {
        return this.onPlayerId;
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
    initializeHostConnetion() {
        this.host.on('signal', data => {
            if (!this.playerId) { throw new Error("Can't signal host without a player id!"); }
            if (!this.gameCode) { throw new Error("Can't signal host without a game code!"); }
            this.socket.send(createSignalHost(this.playerId, this.gameCode, data));
        });

        this.host.on('connect', () => {
            console.log("Connected to the Host!");
            this.host.send("hi from player!");
        });

        this.host.on('data', data => {
            alert("data from host!");
            console.log("Data from host", data);
        });

        this.host.on('error', e => {
            console.error("error from host", e);
        });
    }
}

export interface WebSocketServerMessage {
    type: "NewPlayer" | "NewPlayerResponse" | "SignalHost" | "SignalPlayer",
}

export interface NewPlayer extends WebSocketServerMessage {
    type: "NewPlayer",
    gameCode: string,
}

function createNewPlayer(gameCode: string): string {
    const request: NewPlayer = { type: "NewPlayer", gameCode };
    return JSON.stringify(request);
}

export interface NewPlayerResponse extends WebSocketServerMessage {
    type: "NewPlayerResponse",
    playerId: string,
}

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