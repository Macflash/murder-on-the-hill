import { GameData } from "../gameData";

export type RtcEventType =
    "StartGame" |
    "AddPlayer" |
    "UpdatePlayer" |
    "AddTile";

export interface RtcEvent {
    type: RtcEventType;
}

export interface StartGameEvent extends RtcEvent {
    type: "StartGame",
    // No other message
    game: GameData,
}

export function StartGameMessage(game: GameData): string {
    const message: StartGameEvent = {
        type: "StartGame",
        game,
    };
    return JSON.stringify(message);
}
