import React from 'react';
import { GridTile } from '../../game/tiles/GridTile';
import { ApplyFriction, CollideItems, CollideWithWalls, GetItemsInInteractionDistance, GetTileCoord, MoveItems } from '../../game/items/Collision';
import { Index } from '../../game/tiles/Floor';
import { GridPlayer, player } from '../../game/items/Player';
import { GetItems } from '../../game/items/Items';
import { Interactions, SetInteractables } from '../../game/hud/Hud_Interaction';
import { Inventory } from '../../game/hud/Inventory';
import { DoSightLineThing } from '../../game/tiles/Rooms';
import { HudStats } from '../../game/hud/Hud_Stats';
import { GetMonsters } from '../../game/items/Monsters';
import { HostGameData } from '../../rtc/HostGameData';


export let centerX = 0;
export let centerY = 0;

export var RenderApp = () => { };
var showMap = false;

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

export function HostGame(props: {isHost: boolean}) {
  const [, setState] = React.useState(0);
  const rerender = React.useCallback(() => {
    setState(Math.random());
  }, [setState]);

  React.useEffect(() => { RenderApp = rerender; }, [rerender]);

  // start animating
  React.useEffect(() => {
    // every frame things
    animate();

    // SLOW STUFF
    setInterval(() => {
      GetMonsters().forEach(monster => monster.decide_move([player]));
    }, 1000);
  }, []);

  const center = { x: centerX, y: centerY };
  return (
    <div className="App" style={{ overflow: "hidden" }}>
      {showMap ?
        <div style={{ zIndex: 100, bottom: 0, padding: 20, position: "absolute", left: 0, right: 0 }}>
          <div style={{ color: "white" }}>Map</div>
          <button onClick={() => { centerX = 0; centerY = 0; rerender(); }}>Recenter Map</button>
        </div> : null}

      <GridPlayer center={center} player={player} />

      <canvas id="Canvas_SightResult"
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          ...canvasStyle,
          zIndex: 6,
        }} />

      {HostGameData.Get().yourFloor.tiles.map((tile) => <GridTile
        RenderApp={rerender}
        center={center}
        overlayMode={true}
        floor={HostGameData.Get().yourFloor}
        tile={tile}
        key={Index(tile.x, tile.y)}
      />)}

      <Interactions player={player} center={center} />
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
  CollideWithWalls(player, HostGameData.Get().yourFloor, true);
  GetItems().filter(item => item.moveable && item.blockObjects).forEach(item => CollideWithWalls(item, HostGameData.Get().yourFloor));

  GetMonsters().forEach(monster => {
    const attackingPlayer = monster.checkForAttack([player]);
    if (attackingPlayer) {
      // do rolls and stuff!
      const playerRoll = attackingPlayer.stats.roll(monster.attackType);
      const monsterRoll = monster.stats.roll(monster.attackType);
    }
  });

  ApplyFriction([player]);

  // TODO: don't check for interaction distance EVERY frame, this is totaly overkill
  // BRO DO we really need ROOM items vs NORMAL items??
  // room items should probably be only things that ARENT moveable.
  // like decorative things or things for the room geometry like counters and shelves and stuff.  
  const roomItems = HostGameData.Get().yourFloor.getCoord(GetTileCoord(player.position))?.info.items?.filter(item => !item.hidden);
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

  DoSightLineThing(player, HostGameData.Get().yourFloor, center);
  //  DrawAllRooms(FirstFloor);
  // BASIC fog, wont need latershowFog && UpdateFog(player, FirstFloor);
  RenderApp();
  requestAnimationFrame(() => animate());
}
