import { Player } from "../../game/items/Player";
import { RtcEvent } from "./rtcEvents";

export interface PlayerAddedEvent extends RtcEvent {
    type: "AddPlayer",
    player: Player,
}

export function PlayerAddedEvent(player: Player): string {
    const message: PlayerAddedEvent = {
        type: "AddPlayer",
        player
    };
    return JSON.stringify(message);
}