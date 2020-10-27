export type RtcEventType =
    "StartGame" |
    "AddTile";

export interface RtcEvent {
    type: RtcEventType;
}

export interface StartGameEvent extends RtcEvent{
    type: "StartGame",
    // No other message
}

export function StartGameMessage(): string {
    const message: StartGameEvent = {
        type: "StartGame",
    };
    return JSON.stringify(message);
}