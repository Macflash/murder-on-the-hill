import React from 'react';
import { GridTile } from '../../game/tiles/GridTile';
import { GridPlayer } from '../../game/items/Player';
import { Interactions } from '../../game/hud/Hud_Interaction';
import { Inventory } from '../../game/hud/Inventory';
import { DoSightLineThing } from '../../game/tiles/Rooms';
import { HudStats } from '../../game/hud/Hud_Stats';
import { PlayerGameData } from '../../rtc/PlayerGameData';
import { HandlePlayerKeys } from './HandlePlayerKeys';
import { Coord } from '../../game/coordinates/Coord';
import { Index } from '../../game/tiles/Floor';

const center: Coord = { x: 0, y: 0 };

export var RenderApp = () => { };

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

export function PlayerGame() {
  const [, setState] = React.useState(0);
  const rerender = React.useCallback(() => {
    setState(Math.random());
  }, [setState]);

  // start animating
  React.useEffect(() => {
    PlayerGameData.Get().onDataChanged(() => rerender());
  }, [rerender]);

  React.useEffect(() => { RenderApp = rerender; }, [rerender]);

  const player = PlayerGameData.Get().you;
  const floor = PlayerGameData.Get().yourFloor;
  const { showMap } = HandlePlayerKeys(player, center);

  // start animating
  React.useEffect(() => {
    // every frame things
    animate();
  }, []);


  return (
    <div className="App" style={{ overflow: "hidden" }}>
      {showMap ?
        <div style={{ zIndex: 100, bottom: 0, padding: 20, position: "absolute", left: 0, right: 0 }}>
          <div style={{ color: "white" }}>Map</div>
          <button onClick={() => {
            center.x = 0;
            center.y = 0;
            rerender();
          }}>Recenter Map</button>
        </div> : null}

      <GridPlayer player={player} center={center} />

      <canvas id="Canvas_SightResult"
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          ...canvasStyle,
          zIndex: 6,
        }} />

      {floor.tiles.map((tile) => <GridTile
        RenderApp={rerender}
        center={center}
        overlayMode={true}
        floor={floor}
        tile={tile}
        key={Index(tile.x, tile.y)}
      />)}

      <Interactions player={player} center={center} />
      <Inventory player={player} />
      { //<HudStats player={player} />
      }
    </div>
  );
}

function animate() {
  const player = PlayerGameData.Get().you;
  const { showMap } = HandlePlayerKeys(player, center);
  if (!showMap) {
    center.x = player.position.x;
    center.y = player.position.y;
  }

  DoSightLineThing(player, PlayerGameData.Get().yourFloor, center);
  RenderApp();
  requestAnimationFrame(() => animate());
}

