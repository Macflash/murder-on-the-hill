import { RtcEvent, StartGameEvent } from "./events/rtcEvents";
import { PlayerConnection } from "./player_api";
import { BaseGameData } from "./gameData";
import { TileAddedEvent } from "./events/tileEvents";
import { Floor } from "../game/tiles/Floor";
import { PlayerAddedEvent } from "./events/playerEvents";

// Handles the game state for a remote player.
export class PlayerGameData extends BaseGameData {
    private static gameCode: string;
    private static instance: PlayerGameData;
    public static Set(gameCode: string) {
        if (PlayerGameData.gameCode && PlayerGameData.gameCode !== gameCode) {
            throw new Error(`Cant change the game code right now! expected ${PlayerGameData.gameCode} got ${gameCode}`);
        }

        PlayerGameData.gameCode = gameCode;
    }

    public static Get() {
        if (!PlayerGameData.gameCode) {
            throw new Error(`Need to set the game code first!`);
        }

        if (!PlayerGameData.instance) {
            PlayerGameData.instance = new PlayerGameData(PlayerGameData.gameCode);
        }

        return PlayerGameData.instance;
    }

    // Jesus the 'this' context switch GOT me. That's a first.
    public readonly connection = new PlayerConnection(data => this.onHostData(data));
    private playerId?: string;

    constructor(gameCode: string) {
        super();
        console.log("created player game data, joining game", gameCode, this.onGameStartListeners);
        this.connection.joinGame(gameCode);
        this.connection.onAssignedPlayerId.then(playerId => this.playerId = playerId);
    }

    get you() {
        return this.players.filter(p => p.playerId == this.playerId)[0];
    }

    get yourFloor() {
        return this.floors[this.you?.position?.floor || 0];
    }

    onHostData(data: string) {
        const hostData = JSON.parse(data) as RtcEvent;
        switch (hostData.type) {
            case "StartGame":
                const startData = hostData as StartGameEvent;
                const { game } = startData;
                console.log("Host started the game!!", this.onGameStartListeners);
                this.Update(game);
                this.notifyGameStart();
                break;
            case "AddPlayer":
                const playerData = hostData as PlayerAddedEvent;
                const { player } = playerData;
                console.log("got a new player from host", player);
                super.AddPlayer(player);
                break;
            case "AddTile":
                const tileData = hostData as TileAddedEvent;
                const { tile } = tileData;
                console.log("got a new tile event from host", tile);
                super.AddTile(tile);
                break;
            default:
                console.error("unrecognized host data", hostData);
        }
    }

    private onGameStartListeners: (() => void)[] = [];
    onGameStart(listener: () => void) {
        this.onGameStartListeners.push(listener);
    }
    notifyGameStart() {
        this.onGameStartListeners.forEach(f => f());
    }
}
