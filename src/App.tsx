import React from 'react';
import logo from './logo.svg';
import './App.css';
import { dir } from 'console';
import { Dir } from 'fs';

type Direction = "TOP" | "LEFT" | "RIGHT" | "BOTTOM";

function AllDirections(): Direction[] {
  return ["TOP", "RIGHT", "BOTTOM", "LEFT"];
}

function Opposite(direction: Direction): Direction {
  switch (direction) {
    case "TOP":
      return "BOTTOM";
    case "BOTTOM":
      return "TOP";
    case "RIGHT":
      return "LEFT";
    case "LEFT":
      return "RIGHT";
  }
}

function Rotate(direction: Direction, rotation: number) {
  const allDirections = AllDirections();
  const index = allDirections.indexOf(direction);
  return allDirections[(index + rotation) % allDirections.length];
}

interface Coord {
  x: number,
  y: number
};

function MoveCoord(c: Coord, direction: Direction): Coord {
  const { x, y } = c;
  // let neightbor: boolean; // Later we might want to be able to "CLOSE" doors again? skip for now.
  switch (direction) {
    case "TOP":
      return { x, y: y - 1 };
    case "BOTTOM":
      return { x, y: y + 1 };
    case "RIGHT":
      return { x: x + 1, y };
    case "LEFT":
      return { x: x - 1, y };
  }
}

type JunctionSet = Set<Direction>;
type Junctions = boolean[];
type JMap = Map<number, Tile>;

interface TileInfo {
  name: string;

  doors: Direction[],
}

class Tile {
  // Rotations RIGHT in 90 increments. 0-3;
  //public rotation = 0; // TODO
  public x = 0;
  public y = 0;
  private initialDoors: Set<Direction>;
  private rotation = 0;

  constructor(public readonly info: TileInfo) {
    const { doors } = info;
    this.initialDoors = new Set<Direction>(doors);
  }

  get coord(): Coord {
    return { x: this.x, y: this.y };
  }

  get doors(): Set<Direction> {
    const rotatedDoors = new Set<Direction>();
    this.initialDoors.forEach(door => { rotatedDoors.add(Rotate(door, this.rotation)) });
    return rotatedDoors;
  }

  /** Return valid rotations for the tile to be placed in a spot with the given constraints. */
  // TODO: Handle ROTATION PROBABLY!
  canPlace(neededDoors: Set<Direction>, neededWalls: Set<Direction>): boolean {
    // TODO: Wait what about WALLS where we SHOULDNT have doors!
    // ensure all needed doors are there
    let canPlace = true;
    neededDoors.forEach(direction => {
      if (!this.doors.has(direction)) {
        canPlace = false;
      }
    });

    // ensure all needed walls have no doors!
    neededWalls.forEach(direction => {
      if (this.doors.has(direction)) {
        canPlace = false;
      }
    });

    return canPlace;
  }

  copy(r?: number) {
    const t = new Tile(this.info);
    if (r) {
      t.rotate(r);
    }
    else {
      t.rotate(this.rotation);
    }
    return t;
  }

  rotate(r: number) {
    this.rotation = r % 4;
    return this;
  }

  hasNeighbor(floor: Floor, direction: Direction): boolean {
    // let neightbor: boolean; // Later we might want to be able to "CLOSE" doors again? skip for now.
    return floor.hasCoord(MoveCoord(this.coord, direction));
  }
}


export const GridTile: React.FC<{ tile: Tile, floor: Floor }> = props => {
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
    {AllDirections().map(d => <GridWall tile={tile} floor={floor} direction={d} hasDoor={tile.doors.has(d)} opened={tile.hasNeighbor(floor, d)} />)}
  </div>;
}

const wallSize = 10;
const doorSize = 48;

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

export const GridWall: React.FC<{ tile: Tile, floor: Floor, direction: Direction, hasDoor: boolean, opened: boolean }> = props => {
  const { direction, opened, hasDoor, tile, floor } = props;
  const row = direction == "TOP" || direction == "BOTTOM";
  const filler = <div style={{ flex: "auto", backgroundColor: "black", height: row ? "100%" : undefined, width: row ? undefined : "100%" }}></div>;

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
}

const FourWay = new Tile({ name: "Fourway", doors: ["TOP", "LEFT", "RIGHT", "BOTTOM"] });
const TeeWay = new Tile({ name: "TeeWay", doors: ["TOP", "LEFT", "RIGHT"] });
const Straight = new Tile({ name: "Straight", doors: ["TOP", "BOTTOM"] });
const LTurn = new Tile({ name: "LTurn", doors: ["TOP", "RIGHT"] });
const RTurn = new Tile({ name: "RTurn", doors: ["TOP", "LEFT"] });
const DeadEnd = new Tile({ name: "DeadEnd", doors: ["TOP"] });


function AllWay(tile: Tile): Tile[] {
  return [tile, tile.copy(1), tile.copy(2), tile.copy(3)];
}

function TwoWay(tile: Tile): Tile[] {
  return [tile, tile.copy(1)];
}

const TileLibrary = [
  ...TwoWay(FourWay),
  ...TwoWay(Straight),
  ...AllWay(TeeWay),
  ...AllWay(LTurn),
  ...AllWay(RTurn),
  ...AllWay(DeadEnd),
];


class Floor {
  constructor(public readonly name: string) { }

  private grid = new Map<string, Tile>();

  private index(x: number, y: number) { return `${x}, ${y}`; }

  getCoord(c: Coord): Tile | undefined { return this.getTile(c.x, c.y); }
  getTile(x: number, y: number): Tile | undefined { return this.grid.get(this.index(x, y)); }

  hasCoord(c: Coord): boolean { return this.hasTile(c.x, c.y); }
  hasTile(x: number, y: number): boolean { return this.grid.has(this.index(x, y)); }

  setCoord(tile: Tile, c: Coord) { this.setTile(tile, c.x, c.y); }
  setTile(tile: Tile, x: number, y: number) {
    if (this.hasTile(x, y)) {
      alert("Already had a tile there!");
      throw "already had a tile!";
    }

    tile.x = x;
    tile.y = y;
    this.grid.set(this.index(x, y), tile);
  }

  get tiles(): Tile[] {
    return Array.from(this.grid, ([key, tile]) => tile);
  }

  // return all POSSIBLE playing places
  getValidSpotsForTiles() {
    // this is maybe not the best approach. Cool ,but not needed right now...
  }

  fillCoord(c: Coord) { this.fillTile(c.x, c.y); }
  fillTile(x: number, y: number) {
    // fill a gap with a VALID tile. Woops do we need rotation soon?
    // 1. get all tiles bordering this.
    const neighbors = AllDirections().map(d => this.getCoord(MoveCoord({ x, y }, d)));
    const neededDoors = new Set<Direction>();
    const neededWalls = new Set<Direction>();

    AllDirections().forEach(direction => {
      const neighbor = this.getCoord(MoveCoord({ x, y }, direction));
      if (neighbor) {
        if (neighbor.doors.has(Opposite(direction))) {
          neededDoors.add(direction);
        }
        else {
          neededWalls.add(direction);
        }
      }
    });

    console.log("fill tile needs these doors:", neededDoors, "and these walls:", neededWalls);

    // now find available tiles
    const matchingTiles = TileLibrary.filter(tile => tile.canPlace(neededDoors, neededWalls));
    console.log("These tiles could fit here!", matchingTiles);
    // pick a random tile!

    if (!matchingTiles) { throw "wow we should really fix that!"; }

    const newTile = matchingTiles[Math.floor(Math.random() * matchingTiles.length)].copy();
    console.log("adding new tile!", newTile);
    this.setTile(newTile, x, y);
  }
}

const FirstFloor = new Floor("Main Floor");
FirstFloor.setTile(FourWay.copy(), 0, 0);

const tileSize = 200;
let centerX = 0;
let centerY = 0;

var RenderApp = () => { };

function App() {
  const [, setState] = React.useState(0);
  const rerender = React.useCallback(() => {
    setState(Math.random());
  }, [setState]);

  React.useEffect(() => { RenderApp = rerender; }, [rerender]);
  return (
    <div className="App" style={{ overflow: "hidden" }}>
      <div style={{ zIndex: 100, bottom: 0, padding: 20, position: "absolute", left: 0, right: 0 }}>
        <button onClick={() => { centerY -= 100; rerender(); }}>UP!</button>
        <button onClick={() => { centerY += 100; rerender(); }}>DOWN!</button>
        <button onClick={() => { centerX -= 100; rerender(); }}>LEFT!</button>
        <button onClick={() => { centerX += 100; rerender(); }}>RIGHT!</button>
        <button onClick={() => { centerX = 0; centerY = 0; rerender(); }}>CENTER!</button>
      </div>
      <div style={{ position: "absolute", zIndex: 50, height: 25, width: 10, backgroundColor: "red", left: "calc(50% - 10px)", right: "calc(50% + 10px)", top: "calc(50% - 25px)", bottom: "calc(50% + 25px)", padding: 5 }}></div>
      <div id="gamefloor">
        {FirstFloor.tiles.map((p, i) => <GridTile floor={FirstFloor} tile={p} key={i} />)}
      </div>
    </div>
  );
}

let leftPressed = false;
let upPressed = false;
let rightPressed = false;
let downPressed = false;

document.addEventListener('keydown', e => {
  console.log(e.key);
  if (e.key == "a" || e.key == "ArrowLeft") {
    leftPressed = true;
    rightPressed = false;
  }
  if (e.key == "d" || e.key == "ArrowRight") {
    rightPressed = true;
    leftPressed = false;
  }
  if (e.key == "w" || e.key == "ArrowUp") {
    upPressed = true;
    downPressed = false;
  }
  if (e.key == "s" || e.key == "ArrowDown") {
    downPressed = true;
    upPressed = false;
  }
});

document.addEventListener('keyup', e => {
  console.log(e.key);
  if (e.key == "a" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
  if (e.key == "d" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  if (e.key == "w" || e.key == "ArrowUp") {
    upPressed = false;
  }
  if (e.key == "s" || e.key == "ArrowDown") {
    downPressed = false;
  }
});

const moveSpeed =2;

function animate(){
  if (leftPressed) {
    centerX -= moveSpeed;
  }
  if (rightPressed) {
    centerX += moveSpeed;
  }
  if (upPressed) {
    centerY -= moveSpeed;
  }
  if (downPressed) {
    centerY += moveSpeed;
  }
  RenderApp();
  requestAnimationFrame(()=>animate());
}

animate();

export default App;
