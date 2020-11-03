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

export interface PlayerUpdateEvent extends RtcEvent {
    type: "UpdatePlayer",
    player: Player,
}

export function PlayerUpdateEvent(player: Player): string {
    const message: PlayerUpdateEvent = {
        type: "UpdatePlayer",
        player
    };
    return JSON.stringify(message);
}