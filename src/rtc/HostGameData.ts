import { TileInfo } from "../game/tiles/Tile";
import { RtcEvent, StartGameMessage } from "./events/rtcEvents";
import { TileAddedMessage } from "./events/tileEvents";
import { PlayerAddedEvent, PlayerUpdateEvent } from "./events/playerEvents";
import { HostConnection } from "./host_api";
import { BaseGameData } from "./gameData";
import { BasicPlayer, player, Player } from "../game/items/Player";
import { Entrance } from "../game/tiles/Rooms";


export class HostGameData extends BaseGameData {
    private static instance: HostGameData;
    public static Get() {
        if (!HostGameData.instance) {
            HostGameData.instance = new HostGameData();
        }

        return HostGameData.instance;
    }

    public readonly connection = new HostConnection((playerId, data) => this.onPlayerData(playerId, data));

    constructor() {
        super();
        this.connection.hostNewGame();

        // init some basic stuff for the game!
        this.players.push(BasicPlayer("host"));
        const entrance = Entrance.copy();
        entrance.floor = 0;
        entrance.x = 0;
        entrance.y = 0;
        this.AddTile(entrance.toInfo()); // we did this BEFORE anyone joined...

        this.connection.onPlayerJoin(() => {
            // create a player object for all NEW players;
            this.connection.playerIds.forEach(playerId => {
                if (!this.players.find(p => p.id === playerId)) {
                    this.AddPlayer(BasicPlayer(playerId));
                }
            })
        });
    }

    get you() {
        // this is wrong but.. like whatever for now.
        return this.players[0];
    }

    get yourFloor() {
        //console.log("your floor host", this.floors, this.you.position);
        return this.floors[this.you.position.floor || 0];
    }

    onPlayerData(playerId: string, data: string) {
        const playerData = JSON.parse(data) as RtcEvent;
        switch (playerData.type) {
            case "UpdatePlayer":
                const playerUpdateData = playerData as PlayerUpdateEvent;
                const { player: playerUpdate } = playerUpdateData;
                //console.log(playerId, playerUpdate.playerId, "updating", player);
                //if (playerId !== player.playerId) { throw "Player id updates didnt match!"; }
                super.UpdatePlayer(playerUpdate);
                break;
        }
    }

    StartGame() {
        this.SetStarted();
        this.connection.sendToAllPlayers(StartGameMessage(this.toGameDataObj()));
    }

    // Basically override all the basic data set events and include sending them to the players??
    // Floor related stuff
    AddPlayer(player: Player) {
        super.AddPlayer(player);
        this.connection.sendToAllPlayers(PlayerAddedEvent(player));
    }

    // Floor related stuff
    AddTile(tile: TileInfo) {
        super.AddTile(tile);
        this.connection.sendToAllPlayers(TileAddedMessage(tile));
    }


    // all updates and action stuff should be part of the game data object!
}
