import React from 'react';
import './App.css';
import { GridTile } from './GridTile';
import { CollidePlayerWithWalls } from './tiles/Collision';
import { FirstFloor, Index } from './tiles/Floor';
import { sightDistance, UpdateFog } from './tiles/SightLines';
import { Player, player } from './Player';
import { GetItems, GridItem, Item } from './tiles/Items';

export let centerX = 0;
export let centerY = 0;

export var RenderApp = () => { };

var showMap = false;
var showFog = false; // turn off for now.. Sightlines would be cool, but circle looks dumb.

function App() {
  const [, setState] = React.useState(0);
  const rerender = React.useCallback(() => {
    setState(Math.random());
  }, [setState]);

  React.useEffect(() => { RenderApp = rerender; }, [rerender]);

  return (
    <div className="App" style={{ overflow: "hidden" }}>
      {showMap ?
        <div style={{ zIndex: 100, bottom: 0, padding: 20, position: "absolute", left: 0, right: 0 }}>
          <div style={{ color: "white" }}>Map</div>
          <button onClick={() => { centerY -= 100; rerender(); }}>UP!</button>
          <button onClick={() => { centerY += 100; rerender(); }}>DOWN!</button>
          <button onClick={() => { centerX -= 100; rerender(); }}>LEFT!</button>
          <button onClick={() => { centerX += 100; rerender(); }}>RIGHT!</button>
          <button onClick={() => { centerX = 0; centerY = 0; rerender(); }}>CENTER!</button>
        </div> : null}
      <Player />

      <div>
        { showFog ? <canvas id="fog"
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            mixBlendMode: "multiply",
            position: "absolute",
            zIndex: 5,
            width: "100%",
            height: "100%",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            //filter: "blur(25px)",
          }} /> : null}

        <div id="gamefloor" style={{ mixBlendMode: "normal" }}>
          
          {FirstFloor.tiles.map((tile) => <GridTile
            overlayMode={showMap}
            floor={FirstFloor}
            tile={tile}
            key={Index(tile.x, tile.y)}
          />)}

            {GetItems().map((item) => <GridItem item={item} />)}

        </div>
      </div>

    </div>
  );
}

function GetScreenSpaceCoord(item: Item){
  return {
    top: item
  }
}

let leftPressed = false;
let upPressed = false;
let rightPressed = false;
let downPressed = false;

let mPressed = false;

let s = sightDistance;

document.addEventListener('keydown', e => {
  if (e.key == "m" || e.key == "M") {
    if (!mPressed) { showMap = !showMap; }
    mPressed = true;
  }

  if (e.key == "a" || e.key == "A" || e.key == "ArrowLeft") {
    leftPressed = true;
    rightPressed = false;
  }
  if (e.key == "d" || e.key == "D" || e.key == "ArrowRight") {
    rightPressed = true;
    leftPressed = false;
  }
  if (e.key == "w" || e.key == "W" || e.key == "ArrowUp") {
    upPressed = true;
    downPressed = false;
  }
  if (e.key == "s" || e.key == "S" || e.key == "ArrowDown") {
    downPressed = true;
    upPressed = false;
  }
});

document.addEventListener('keyup', e => {
  //console.log(e.key);
  if (e.key == "a" || e.key == "A" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
  if (e.key == "d" || e.key == "D" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  if (e.key == "w" || e.key == "W" || e.key == "ArrowUp") {
    upPressed = false;
  }
  if (e.key == "s" || e.key == "S" || e.key == "ArrowDown") {
    downPressed = false;
  }
  if (e.key == "m" || e.key == "M") {
    mPressed = false;
  }
});

const moveSpeed = 2;
const mapSpeed = 7;

function animate() {
  if (showMap) {
    if (leftPressed) {
      centerX -= mapSpeed;
    }
    if (rightPressed) {
      centerX += mapSpeed;
    }
    if (upPressed) {
      centerY -= mapSpeed;
    }
    if (downPressed) {
      centerY += mapSpeed;
    }
  }
  else {
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
  }

  // for now we are assuming the player is ALWAYS centered. 
  // This is probably bad and we may want to change it when we switch to a canvas based approach.

  CollidePlayerWithWalls(player, FirstFloor);

  // FOLLOW CAM
  if (!showMap) {
    centerX = player.position.x;
    centerY = player.position.y;
  }

  UpdateFog();
  RenderApp();
  requestAnimationFrame(() => animate());
}

animate();

export default App;
