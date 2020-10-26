import * as React from 'react';

export function MainMenu(props: {
  setState: (state: "Menu" | "Game" | "Lobby") => void,
  gameCode: string,
  setGameCode: (code: string) => void,
  setIsHost: (isHost: boolean) => void,
  setIsLocal?: (isLocal: boolean) => void,
}) {
  return <div style={{ color: "white" }}>
    <div>Murder on the Hill</div>
    <div>
      <input type="textfield" value={props.gameCode} onChange={v => props.setGameCode(v.target.value)} />
      <button disabled={!props.gameCode} onClick={() => {
        props.setIsHost(false);
        props.setState("Lobby");
      }}>
        Join a game
        </button>
    </div>
    <div>
      <button onClick={() => {
        props.setIsHost(true);
        props.setGameCode("");
        props.setState("Lobby");
      }}>
        Host a new game
      </button>
    </div>
    <div>
      <button onClick={() => {
        props.setIsLocal?.(true);
        props.setIsHost(true);
        props.setGameCode("");
        props.setState("Game");
      }}>
        Play locally
      </button>
    </div>
  </div>
}