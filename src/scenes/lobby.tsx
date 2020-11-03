import * as React from 'react';
import { HostGameData } from "../rtc/HostGameData";
import { PlayerGameData } from "../rtc/PlayerGameData";
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
    if (!props.isHost) { throw new Error("Player can't access host lobby!!") }

    HostGameData.Get().connection.onAssignedGameCode
        .then(code => props.setGameCode(code));

    const [players, setPlayers] = React.useState(HostGameData.Get().connection.playerIds);
    React.useEffect(() => {
        HostGameData.Get().connection.onPlayerJoin(() => {
            setPlayers(HostGameData.Get().connection.playerIds);
        })
    }, [setPlayers]);

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
                        HostGameData.Get().StartGame();
                        props.setState("Game");
                    }}>Start!</button>
                </div>
                : null}

            <div>
                <div>Players: </div>
                {
                    HostGameData.Get().connection.playerIds.map(id => <div>{id}</div>)
                }
            </div>
        </div>
    </div>
}

function PlayerLobby(props: LobbyProps) {
    if (props.isHost) { throw new Error("Host can't access player lobby!!") }

    const [playerId, setPlayerId] = React.useState("");

    if (!playerId) {
        PlayerGameData.Set(props.gameCode);
        PlayerGameData.Get().connection.onAssignedPlayerId
            .then(id => setPlayerId(id));
    }

    const [players, setPlayers] = React.useState([...PlayerGameData.Get().players]);

    console.log("rendering!", players);
    React.useEffect(() => {
        PlayerGameData.Get().onDataChanged(() => {
            //console.log("player data changed changed", PlayerGameData.Get().players);
            setPlayers([...PlayerGameData.Get().players]);
        })
    }, [setPlayers]);
    
    React.useEffect(() => {
        PlayerGameData.Get().onGameStart(() => {
            console.log("switching to the game, cause on game started!");
            props.setState("Game");
        })
    }, [props.setState]);

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

        <div>
            <div>Players: </div>
            {
                players.map(p => <div key={p.playerId}>
                    {p.name}: 
                    {p.playerId}
                    {p === PlayerGameData.Get().you ? "(You)" : null}
                </div>)
            }
        </div>

    </div>
} 