import React from 'react';
import { Coord, EitherDirectionDistance, MoveCoord } from './tiles/Coord';
import { Direction, AllDirections } from './tiles/Direction';
import { Tile } from './tiles/Tile';
import { centerY, centerX, RenderApp } from './App';
import { Floor } from "./tiles/Floor";
import { GetTileCoord } from './tiles/Collision';
import { doorSize, tileSize, wallSize } from './tiles/Size';
import { GridItem } from './tiles/Items';

// probably only update this on resize
export function GetTileViewDist(){
var screenSize = Math.max(window.innerWidth, window.innerHeight);
return Math.ceil(screenSize / (2 * tileSize));
}

export var tileViewDist = GetTileViewDist();

console.log("grid tile tileViewDist", tileViewDist);

window.addEventListener('resize', ()=>{
  tileViewDist = GetTileViewDist();
});

console.log("Initial view dist", tileViewDist);

export function GetTileTopAndLeft(tileCoord: Coord, center: Coord){
  return {
    x: tileCoord.x * tileSize + .5 * (window.innerWidth - tileSize) - center.x,
    y: tileCoord.y * tileSize + .5 * (window.innerHeight - tileSize) - center.y,
  }
}

export const GridTile: React.FC<{ tile: Tile; floor: Floor; overlayMode: boolean}> = props => {
  const { tile, floor, overlayMode } = props;

  // check screen space if we should render it!
  const tileCoord = { x: tile.x, y: tile.y };
  const cameraCoord = GetTileCoord({ x: centerX, y: centerY });
  if (EitherDirectionDistance(tileCoord, cameraCoord) > tileViewDist) {
    return null;
  }

  return <><div
    style={{
      zIndex: overlayMode ? 10 : 4,
      position: "absolute",
      height: tileSize,
      width: tileSize,
      top: tile.y! * tileSize + .5 * (window.innerHeight - tileSize) - centerY,
      left: tile.x! * tileSize + .5 * (window.innerWidth - tileSize) - centerX,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      //border: '5px solid black',
      backgroundColor:  overlayMode ? undefined : "#663333",
      //backgroundImage: overlayMode ? undefined : `url(${tile.info.image})`,
    }}>
    {tile.info.name}
    {AllDirections().map(d => <GridWall
      overlayMode={overlayMode}
      tile={tile}
      floor={floor}
      direction={d}
      hasDoor={tile.doors.has(d)}
      opened={tile.hasNeighbor(floor, d)}
    />)}
  </div>
  {tile.info.items?.filter(item => !item.hidden).map(item => <GridItem 
  item={item} 
  // this was bad and you should feel bad: tileOffset={tileCenter}
   />)}
  </>;
}

function getWallPosition(direction: Direction, size: number) {
  let top: string | number = 0;
  let bottom: string | number = 0;
  let left: string | number = 0;
  let right: string | number = 0;

  let width: number | undefined = size;
  let height: number | undefined = size;

  switch (direction) {
    case "TOP":
      bottom = "auto";
      width = undefined;
      break;
    case "BOTTOM":
      top = "auto";
      width = undefined;
      break;
    case "RIGHT":
      left = "auto";
      height = undefined;
      break;
    case "LEFT":
      right = "auto";
      height = undefined;
      break;
  }

  return { top, bottom, left, right, width, height };
}

export const GridWall: React.FC<{ overlayMode: boolean, tile: Tile; floor: Floor; direction: Direction; hasDoor: boolean; opened: boolean; }> = props => {
  const { direction, opened, hasDoor, tile, floor } = props;
  const row = direction === "TOP" || direction === "BOTTOM";
  const filler = <div style={{ 
    flex: "auto",
     backgroundColor: "#322",
      height: row ? "100%" : undefined, width: row ? undefined : "100%" }}></div>;

  return <div
    style={{
      ...getWallPosition(direction, wallSize),
      position: "absolute",
      display: "flex",
      flexDirection: row ? "row" : "column",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    }}>
    {filler}
    {hasDoor ?
      <div
        style={{ 
          cursor: opened ? undefined : "pointer",
           height: doorSize, 
           width: doorSize,
            backgroundColor: opened ? "" : "grey" }}
        onClick={opened ? undefined : () => {
          floor.fillCoord(MoveCoord(tile.coord, direction));
          RenderApp();
        }}
      >
      </div>
      : null}
    {filler}
  </div>;
};
