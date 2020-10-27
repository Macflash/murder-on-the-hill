
import { Item } from "../game/items/Items";
import { Player } from "../game/items/Player";
import { Creature } from "../game/items/Stats";
import { Floor } from "../game/tiles/Floor";
import { Tile } from "../game/tiles/Tile";
import { RtcEvent, StartGameMessage } from "./events/rtcEvents";
import { TileAddedMessage } from "./events/tileEvents";
import { HostConnection } from "./host_api";
import { PlayerConnection } from "./player_api";

export interface GameData {
    floors: Floor[];
    items: Item[];
    players: Player[];
    monsters: Creature[];

    // anything else?a
}

export class BaseGameData {
    private started = false;
    private floors: Floor[] = [];
    private items: Item[] = [];
    private players: Player[] = [];
    private monsters: Creature[] = [];

    IsStarted() { return this.started; }
    SetStarted() {
        this.started = true;
    }

    // Floor related stuff
    AddTile(tile: Tile) {
        const floor = this.floors[tile.floor];
        if (!floor) {
            this.floors[tile.floor] = new Floor("", tile.floor);
        }

        floor.setCoord(tile, tile.coord);
    }
}

export class HostGameData extends BaseGameData {
    public readonly connection = new HostConnection(this.onPlayerData);

    constructor() {
        super();
        console.log("creating host game data");
        this.connection.hostNewGame();
    }

    onPlayerData(playerId: string, data: string) {

    }

    StartGame() {
        this.SetStarted();
        this.connection.sendToAllPlayers(StartGameMessage());
    }

    // Basically override all the basic data set events and include sending them to the players??
    // Floor related stuff
    AddTile(tile: Tile) {
        super.AddTile(tile);
        this.connection.sendToAllPlayers(TileAddedMessage(tile));
    }
}

export class PlayerGameData extends BaseGameData {
    public readonly connection = new PlayerConnection(this.onHostData);

    constructor(gameCode: string) {
        super();
        console.log("created player game data, joining game", gameCode);
        this.connection.joinGame(gameCode);
    }

    onHostData(data: string) {
        const hostData = JSON.parse(data) as RtcEvent;
        switch (hostData.type) {
            default:
                console.error("unrecognized host data", hostData);
        }
    }
}