import * as React from 'react';
import { HostConnection } from '../rtc/host_api';
import { PlayerConnection } from '../rtc/player_api';
interface LobbyProps {
    setState: (state: "Menu" | "Game" | "Lobby") => void,
    gameCode: string,
    isHost: boolean,
    setGameCode: (code: string) => void,
}

export function Lobby(props: LobbyProps) {
    return props.isHost ? <HostLobby {...props} /> : <PlayerLobby {...props} />;
}

function HostLobby(props: LobbyProps) {
    React.useEffect(() => {
        if (props.isHost) {
            const hc = new HostConnection();
            hc.hostNewGame();
            hc.onAssignedGameCode.then(code => props.setGameCode(code));
        }
    }, []);

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
                        props.setState("Game");
                    }}>Start!</button>
                </div>
                : null}
        </div>
    </div>
}

function PlayerLobby(props: LobbyProps) {
    const [playerId, setPlayerId] = React.useState("");

    React.useEffect(() => {
        if (!props.isHost) {
            const pc = new PlayerConnection();
            pc.joinGame(props.gameCode);
            pc.onAssignedPlayerId.then(id => setPlayerId(id));
        }
    }, []);

    return <div style={{ color: "white" }}>
        <div>Murder on the Hill</div>
        {props.gameCode ?
            <div>Game Code: {props.gameCode}.</div> :
            null
        }

        {playerId ?
            <div>Your id: {playerId}.</div> :
            <div>Connecting to server...</div>
        }


        {props.gameCode && playerId ?
            "Connecting to host!" : null
        }

    </div>
}