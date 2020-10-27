import { Tile } from "../../game/tiles/Tile";
import { RtcEvent } from "./rtcEvents";

export interface TileAddedEvent extends RtcEvent {
 type: "AddTile",
 tile: Tile,
}

export function TileAddedMessage(tile: Tile): string {
    const message: TileAddedEvent = {
        type: "AddTile",
        tile
    };
    return JSON.stringify(message);
}