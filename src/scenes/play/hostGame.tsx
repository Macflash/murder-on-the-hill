import React from 'react';
import { GridTile } from '../../game/tiles/GridTile';
import { ApplyFriction, CollideItems, CollideWithWalls, GetItemsInInteractionDistance, GetTileCoord, MoveItems } from '../../game/items/Collision';
import { Index } from '../../game/tiles/Floor';
import { GridPlayer } from '../../game/items/Player';
import { GetItems } from '../../game/items/Items';
import { Interactions, SetInteractables } from '../../game/hud/Hud_Interaction';
import { Inventory } from '../../game/hud/Inventory';
import { DoSightLineThing } from '../../game/tiles/Rooms';
import { HudStats } from '../../game/hud/Hud_Stats';
import { GetMonsters } from '../../game/items/Monsters';
import { HostGameData } from '../../rtc/HostGameData';
import { HandlePlayerKeys } from './HandlePlayerKeys';
import { Coord } from '../../game/coordinates/Coord';
import { PlayerUpdateEvent } from '../../rtc/events/playerEvents';

export let center: Coord = { x: 0, y: 0 };

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

let startOnce = true;

export function HostGame(props: { isHost: boolean }) {
  const [, setState] = React.useState(0);
  const rerender = React.useCallback(() => {
    setState(Math.random());
  }, [setState]);

  React.useEffect(() => { RenderApp = rerender; }, [rerender]);

  // start animating
  React.useEffect(() => {
    if (startOnce) {
      animate();
      // SLOW STUFF
      setInterval(() => {
        // SLOW STUFF
        //HostGameData.Get().connection.sendToAllPlayers(PlayerUpdateEvent(player));
        GetMonsters().forEach(monster => monster.decide_move(HostGameData.Get().players));
      }, 250);
    }
    startOnce = false;
    // every frame things

  }, []);

  const player = HostGameData.Get().you;

  return (
    <div className="App" style={{ overflow: "hidden" }}>
      {showMap ?
        <div style={{ zIndex: 100, bottom: 0, padding: 20, position: "absolute", left: 0, right: 0 }}>
          <div style={{ color: "white" }}>Map</div>
          <button onClick={() => { center.x = 0; center.y = 0; rerender(); }}>Recenter Map</button>
        </div> : null}

      {HostGameData.Get().players.map(p =>
        <GridPlayer key={p.playerId} player={p} center={center} />
      )}

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

function animate() {
  const player = HostGameData.Get().you;
  const { showMap, changed } = HandlePlayerKeys(player, center);
  
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

  if (changed || player.velocity.x !== 0 || player.velocity.y !== 0) {
    //console.log("sending player update");
    HostGameData.Get().connection.sendToAllPlayers(PlayerUpdateEvent(player));
  }
  
  // this breaks... everything
  //HostGameData.Get().connection.sendToAllPlayers(PlayerUpdateEvent(player));

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
    center.x = player.position.x;
    center.y = player.position.y;
  }

  DoSightLineThing(player, HostGameData.Get().yourFloor, center);
  //  DrawAllRooms(FirstFloor);
  // BASIC fog, wont need latershowFog && UpdateFog(player, FirstFloor);
  RenderApp();
  requestAnimationFrame(() => animate());
}
