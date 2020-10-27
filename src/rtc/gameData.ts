
// Game data has 2 main parts:
// Host DATA and player data

import { Item } from "../game/items/Items";
import { Player } from "../game/items/Player";
import { Creature } from "../game/items/Stats";
import { Floor } from "../game/tiles/Floor";
import { Tile } from "../game/tiles/Tile";
import { PlayerConnection } from "./player_api";

export interface GameData {
    floors: Floor[];
    items: Item[];
    players: Player[];
    monsters: Creature[];

    // anything else?
}

export class BaseGameData {
    private floors: Floor[] = [];
    private items: Item[] = [];
    private players: Player[] = [];
    private monsters: Creature[] = [];

    // Floor related stuff
    AddTile(tile: Tile) {
        const floor = this.floors[tile.floor];
        if(!floor){
            this.floors[tile.floor] = new Floor("", tile.floor);
        }

        floor.setCoord(tile, tile.coord);
    }
}

export class PlayerGameData extends BaseGameData {
    private connection = new PlayerConnection(this.onHostData);

    constructor(gameCode: string){
        super();
        this.connection.joinGame(gameCode);
    }

    onHostData(data: any){
        //cool
        console.log("Data from host", data);
    }
}