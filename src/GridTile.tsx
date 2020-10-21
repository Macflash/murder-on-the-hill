import React from 'react';
import { MoveCoord } from './tiles/Coord';
import { Direction, AllDirections } from './tiles/Direction';
import { Tile } from './tiles/Tile';
import { tileSize, centerY, centerX, RenderApp } from './App';
import { Floor } from "./tiles/Floor";

export const wallSize = 10;
export const doorSize = 48;

export const GridTile: React.FC<{ tile: Tile; floor: Floor; }> = props => {
  const { tile, floor } = props;

  // todo draw stuff for each EDGE!
  return <div
    style={{
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
      backgroundColor: "#663333",
    }}>
    {tile.info.name}
    {AllDirections().map(d => <GridWall
      tile={tile}
      floor={floor}
      direction={d}
      hasDoor={tile.doors.has(d)}
      opened={tile.hasNeighbor(floor, d)}
    />)}
  </div>;
}

function getWallPosition(direction: Direction) {
  let top: string | number = 0;
  let bottom: string | number = 0;
  let left: string | number = 0;
  let right: string | number = 0;

  let width: number | undefined = wallSize;
  let height: number | undefined = wallSize;

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

export const GridWall: React.FC<{ tile: Tile; floor: Floor; direction: Direction; hasDoor: boolean; opened: boolean; }> = props => {
  const { direction, opened, hasDoor, tile, floor } = props;
  const row = direction == "TOP" || direction == "BOTTOM";
  const filler = <div style={{ flex: "auto", backgroundColor: "#322", height: row ? "100%" : undefined, width: row ? undefined : "100%" }}></div>;

  return <div
    style={{
      ...getWallPosition(direction),
      position: "absolute",
      display: "flex",
      flexDirection: row ? "row" : "column",
      justifyContent: "center",
      alignItems: "center",
      //backgroundColor: "black",
      overflow: "hidden",
    }}>
    {filler}
    {hasDoor ?
      <div
        style={{ cursor: opened ? undefined : "pointer", height: doorSize, width: doorSize, backgroundColor: opened ? "" : "grey" }}
        onClick={opened ? undefined : () => {
          // TODO: add a NEW tile that like.. matches the constraints!
          // for now... FOURWAY!  
          floor.fillCoord(MoveCoord(tile.coord, direction));
          //floor.setCoord(FourWay.create(), Offset(tile.coord, direction));
          RenderApp();
        }}
      >
      </div>
      : null}
    {filler}
  </div>;
};
