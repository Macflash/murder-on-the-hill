import React from 'react';
import './App.css';
import { GridTile } from './GridTile';
import { CollidePlayerWithWalls, Item } from './tiles/Collision';
import { FirstFloor, Index } from './tiles/Floor';

export let centerX = 0;
export let centerY = 0;

export var RenderApp = () => { };

const player: Item = {
  position: { x: 0, y: 0 },
  height: 30,
  width: 15,
}

function Player() {
  const hW = player.width * .5;
  const hH = player.height * .5;
  return <div style={{
    position: "absolute",
    zIndex: 50,
    height: player.height,
    width: player.width,
    backgroundColor: "red",
    left: `calc(50% - ${hW}px)`,
    right: `calc(50% + ${hW}px)`,
    top: `calc(50% - ${hH}px)`,
    bottom: `calc(50% + ${hH}px)`,
  }}>
  </div>;
}

function App() {
  const [, setState] = React.useState(0);
  const rerender = React.useCallback(() => {
    setState(Math.random());
  }, [setState]);

  React.useEffect(() => { RenderApp = rerender; }, [rerender]);
  return (
    <div className="App" style={{ overflow: "hidden" }}>
      {/*
      <div style={{ zIndex: 100, bottom: 0, padding: 20, position: "absolute", left: 0, right: 0 }}>
        <button onClick={() => { centerY -= 100; rerender(); }}>UP!</button>
        <button onClick={() => { centerY += 100; rerender(); }}>DOWN!</button>
        <button onClick={() => { centerX -= 100; rerender(); }}>LEFT!</button>
        <button onClick={() => { centerX += 100; rerender(); }}>RIGHT!</button> 
        <button onClick={() => { centerX = 0; centerY = 0; rerender(); }}>CENTER!</button>
      </div>
      */}
      <Player />

      <div id="gamefloor">
        {FirstFloor.tiles.map((tile) => <GridTile
          floor={FirstFloor}
          tile={tile}
          key={Index(tile.x, tile.y)}
        />)}
      </div>

    </div>
  );
}

let leftPressed = false;
let upPressed = false;
let rightPressed = false;
let downPressed = false;

document.addEventListener('keydown', e => {
  //console.log(e.key);
  if (e.key == "a" || e.key == "A" || e.key == "ArrowLeft") {
    leftPressed = true;
    rightPressed = false;
  }
  if (e.key == "d" ||e.key == "D" || e.key == "ArrowRight") {
    rightPressed = true;
    leftPressed = false;
  }
  if (e.key == "w" ||e.key == "W" || e.key == "ArrowUp") {
    upPressed = true;
    downPressed = false;
  }
  if (e.key == "s" ||e.key == "S" || e.key == "ArrowDown") {
    downPressed = true;
    upPressed = false;
  }
});

document.addEventListener('keyup', e => {
  //console.log(e.key);
  if (e.key == "a" || e.key == "A" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
  if (e.key == "d" ||e.key == "D" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  if (e.key == "w" ||e.key == "W" || e.key == "ArrowUp") {
    upPressed = false;
  }
  if (e.key == "s" ||e.key == "S" || e.key == "ArrowDown") {
    downPressed = false;
  }
});

const moveSpeed = 2;

function animate() {
  if (leftPressed) {
    player.position.x -= moveSpeed;
  }
  if (rightPressed) {
    player.position.x += moveSpeed;
  }
  if (upPressed) {
    player.position.y -= moveSpeed;
  }
  if (downPressed) {
    player.position.y += moveSpeed;
  }

  // for now we are assuming the player is ALWAYS centered. 
  // This is probably bad and we may want to change it when we switch to a canvas based approach.

  CollidePlayerWithWalls(player, FirstFloor);

  // FOLLOW CAM
  centerX = player.position.x;
  centerY = player.position.y;


  RenderApp();
  requestAnimationFrame(() => animate());
}

animate();

export default App;
