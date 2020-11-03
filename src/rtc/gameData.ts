
import { Item } from "../game/items/Items";
import { Player } from "../game/items/Player";
import { Creature } from "../game/items/Stats";
import { Floor } from "../game/tiles/Floor";
import { Tile, TileInfo } from "../game/tiles/Tile";

export interface GameData {
    tiles: TileInfo[];
    items: Item[];
    players: Player[];
    monsters: Creature[];
}

export class BaseGameData implements GameData {
    private started = false;
    public floors: Floor[] = [];
    public items: Item[] = [];
    public players: Player[] = [];
    public monsters: Creature[] = [];

    get tiles() {
        return this.floors.flatMap(floor => floor.tiles.map(t => t.toInfo()));
    }

    IsStarted() { return this.started; }
    SetStarted() {
        this.started = true;
    }

    toGameDataObj(): GameData {
        return {
            tiles: this.tiles,
            items: this.items,
            monsters: this.monsters,
            players: this.players,
        };
    }

    Update(data: GameData) {
        console.log("game data updating (only tiles for now)", data);

        data.tiles.forEach(t => this.AddTile(t));

        //TODO: DODODO
        this.notifyDataChanged();
    }

    UpdateFloors(tiles: TileInfo[]) {
        tiles.forEach(t => this.AddTile(t));
    }

    // Player related stuff
    AddPlayer(player: Player) {
        this.players.push(player);
        this.notifyDataChanged();
    }

    UpdatePlayer(player: Player) {
        let found = false;
        this.players = this.players.map(p => {
            if (p.playerId === player.playerId) {
                found = true;
                return player;
            }

            return p;
        });

        if (!found) {
            console.log("not found adding new player", player, this.players);
            this.players.push(player);
        }

        this.notifyDataChanged();
    }


    // Floor related stuff
    AddTile(tileInfo: TileInfo) {
        const tile = new Tile(tileInfo);
        if (!this.floors[tile.floor]) {
            this.floors[tile.floor] = new Floor("", tile.floor);
        }

        this.floors[tile.floor].setCoord(tile, tile.coord);
        this.notifyDataChanged();
    }

    private onDataChangedListeners: (() => void)[] = [];
    onDataChanged(listener: () => void) {
        this.onDataChangedListeners.push(listener);
    }

    notifyDataChanged() {
        this.onDataChangedListeners.forEach(f => f());
    }
}