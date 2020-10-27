import * as React from 'react';
import { Player } from '../game/items/Player';
import { HostGameData, PlayerGameData } from '../rtc/gameData';
interface LobbyProps {
    setState: (state: "Menu" | "Game" | "Lobby") => void,
    gameCode: string,
    isHost: boolean,
    setGameCode: (code: string) => void,
}

export function Lobby(props: LobbyProps) {
    return props.isHost ? <HostLobby {...props} /> : <PlayerLobby {...props} />;
}

var hostData: HostGameData;
function HostLobby(props: LobbyProps) {
    if (!props.isHost) { throw new Error("Player can't access host lobby!!") }

    if (!hostData) {
        hostData = new HostGameData();
        hostData.connection.onAssignedGameCode
            .then(code => props.setGameCode(code));
    }

    return <div style={{ color: "white" }}>
        <div>Murder on the Hill</div>
        <div>
            {props.isHost ?
                <div>You are the host.</div>
                : null}

            {props.gameCode ?
                <div>Game Code (share this with your other players!): {props.gameCode}.</div> :
                "Connecting to the server..."
            }

            {props.gameCode ?
                <div><br />Waiting for players...</div>
                : null}

            {props.isHost && props.gameCode ?
                <div>
                    <button onClick={() => {
                        hostData.StartGame();
                        props.setState("Game");
                    }}>Start!</button>
                </div>
                : null}
        </div>
    </div>
}

var playerData: PlayerGameData;
function PlayerLobby(props: LobbyProps) {
    if (props.isHost) { throw new Error("Host can't access player lobby!!") }

    if (!playerData) {
        playerData = new PlayerGameData(props.gameCode);
    }

    const [playerId, setPlayerId] = React.useState("");

    if (!playerId) {
        playerData.connection.onAssignedPlayerId
            .then(id => setPlayerId(id));
    }

    return <div style={{ color: "white" }}>
        <div>Murder on the Hill</div>
        {props.gameCode ?
            <div>Game Code: {props.gameCode}.</div> :
            null
        }

        {!playerId ?
            <div>Connecting to server...</div> :
            <div>Your id: {playerId}.</div>
        }

        {props.gameCode && !playerId ?
            "Connecting to host..." :
            <div>Connected.</div>
        }

    </div>
} 