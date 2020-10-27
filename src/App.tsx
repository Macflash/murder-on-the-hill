import './App.css';
import * as React from 'react';
import { MainMenu } from './scenes/mainmenu';
import { Game } from './scenes/game';
import { Lobby } from './scenes/lobby';

export function App() {
  const [state, setState] = React.useState<"Menu" | "Game" | "Lobby">("Menu");
  const [isHost, setIsHost] = React.useState(false);
  const [gameCode, setGameCode] = React.useState<string>();
  if (state == "Menu") {
    return <MainMenu
      setState={setState}
      setGameCode={setGameCode}
      gameCode={gameCode || ""}
      setIsHost={setIsHost}
    />;
  }
  if (state == "Game") {
    return <Game
      isHost={isHost}
    />;
  }
  if (state == "Lobby") {
    return <Lobby
      isHost={isHost}
      setState={setState}
      setGameCode={setGameCode}
      gameCode={gameCode || ""}
    />;
  }

  return <div>
    hi.
  </div>
}

export default App;