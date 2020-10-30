import { TileInfo } from "../../game/tiles/Tile";
import { RtcEvent } from "./rtcEvents";

export interface TileAddedEvent extends RtcEvent {
 type: "AddTile",
 tile: TileInfo,
}

export function TileAddedMessage(tile: TileInfo): string {
    const message: TileAddedEvent = {
        type: "AddTile",
        tile
    };
    return JSON.stringify(message);
}