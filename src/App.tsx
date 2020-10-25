import React from 'react';
import './App.css';
import { GridTile } from './game/tiles/GridTile';
import { ApplyFriction, CollideItems, CollideWithWalls, GetItemsInInteractionDistance, GetTileCoord, MoveItems } from './game/items/Collision';
import { FirstFloor, Index } from './game/tiles/Floor';
import { GridPlayer, player } from './game/items/Player';
import { GetItems, GridItem } from './game/items/Items';
import { Interactions, SetInteractables } from './game/hud/Hud_Interaction';
import { Inventory } from './game/hud/Inventory';
import { DoSightLineThing } from './game/tiles/Rooms';
import { HudStats } from './game/hud/Hud_Stats';
import { GetMonsters } from './game/items/Monsters';

export let centerX = 0;
export let centerY = 0;

export var RenderApp = () => { };

var showMap = false;
var showFog = false; // turn off for now.. Sightlines would be cool, but circle looks dumb.
const canvasStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 5,
  width: "100%",
  height: "100%",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

function App() {
  const [, setState] = React.useState(0);
  const rerender = React.useCallback(() => {
    setState(Math.random());
  }, [setState]);

  React.useEffect(() => { RenderApp = rerender; }, [rerender]);
  const center = { x: centerX, y: centerY };
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
      <GridPlayer center={center} />

      <div>

        {showFog ? <canvas id="fog"
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            ...canvasStyle,
            opacity: .2,
            //mixBlendMode: "multiply",
            filter: "blur(5px)",
          }} /> : null}

        <canvas id="Canvas_SightResult"
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            ...canvasStyle,
            zIndex: 6,
          }} />

        <div id="gamefloor" style={{ mixBlendMode: "normal" }}>

          {FirstFloor.tiles.map((tile) => <GridTile
            RenderApp={rerender}
            center={center}
            overlayMode={true}
            floor={FirstFloor}
            tile={tile}
            key={Index(tile.x, tile.y)}
          />)}

          {GetItems().map((item) => <GridItem item={item} center={center} />)}

        </div>
      </div>

      <Interactions player={player} />
      <Inventory player={player} />
      <HudStats player={player} />

    </div>
  );
}

let leftPressed = false;
let upPressed = false;
let rightPressed = false;
let downPressed = false;

let mPressed = false;

document.addEventListener('keydown', e => {
  if (e.key === "m" || e.key === "M") {
    if (!mPressed) { showMap = !showMap; }
    mPressed = true;
  }

  if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
    leftPressed = true;
    rightPressed = false;
  }
  if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
    rightPressed = true;
    leftPressed = false;
  }
  if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
    upPressed = true;
    downPressed = false;
  }
  if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
    downPressed = true;
    upPressed = false;
  }
});

document.addEventListener('keyup', e => {
  //console.log(e.key);
  if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
  if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
    rightPressed = false;
  }
  if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
    upPressed = false;
  }
  if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
    downPressed = false;
  }
  if (e.key === "m" || e.key === "M") {
    mPressed = false;
  }
});

const moveSpeed = 2;
const playerAccel = .3;
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
    player.velocity = player.velocity || { x: 0, y: 0 };
    if (leftPressed && player.velocity.x > -moveSpeed) {
      //player.position.x -= moveSpeed;
      player.velocity.x -= playerAccel;
      player.imageTransform = undefined;
    }
    if (rightPressed && player.velocity.x < moveSpeed) {
      //player.position.x += moveSpeed;
      player.velocity.x += playerAccel;
      player.imageTransform = "scale(-1,1)";
    }
    if (upPressed && player.velocity.y > -moveSpeed) {
      //player.position.y -= moveSpeed;
      player.velocity.y -= playerAccel;
    }
    if (downPressed && player.velocity.y < moveSpeed) {
      //player.position.y += moveSpeed;
      player.velocity.y += playerAccel;
    }
  }

  MoveItems([player, ...GetMonsters()]);
  CollideWithWalls(player, FirstFloor, true);
  GetItems().filter(item => item.moveable && item.blockObjects).forEach(item => CollideWithWalls(item, FirstFloor));

  GetMonsters().forEach(monster => {
    const attackingPlayer = monster.checkForAttack([player]);
    if (attackingPlayer) {
      // do rolls and stuff!
      const playerRoll = attackingPlayer.stats.roll(monster.attackType);
      const monsterRoll = monster.stats.roll(monster.attackType);
      console.log(`Monster did ${monsterRoll - playerRoll} damage!`);
    }
  })

  ApplyFriction([player]);

  // TODO: don't check for interaction distance EVERY frame, this is totaly overkill
  // BRO DO we really need ROOM items vs NORMAL items??
  // room items should probably be only things that ARENT moveable.
  // like decorative things or things for the room geometry like counters and shelves and stuff.  
  const roomItems = FirstFloor.getCoord(GetTileCoord(player.position))?.info.items?.filter(item => !item.hidden);
  SetInteractables(
    GetItemsInInteractionDistance(
      player,
      [
        ...GetItems(),
        ...(roomItems || []),
      ]
    )
  );

  CollideItems([
    player,
    ...(roomItems?.filter(item => item.moveable || item.blockObjects) || [])
  ]);

  // FOLLOW CAM
  if (!showMap) {
    centerX = player.position.x;
    centerY = player.position.y;
  }

  const center = { x: centerX, y: centerY };

  DoSightLineThing(player, FirstFloor, center);
  //  DrawAllRooms(FirstFloor);
  // BASIC fog, wont need latershowFog && UpdateFog(player, FirstFloor);
  RenderApp();
  requestAnimationFrame(() => animate());
}

animate();

// SLOW STUFF
setInterval(() => {
  GetMonsters().forEach(monster => monster.decide_move([player]));
  console.log("Monsters", GetMonsters(), GetItems());
}, 1000);

export default App;
