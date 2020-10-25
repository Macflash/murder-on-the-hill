import { Add, Coord, MoveCoord, Multiply } from '../coordinates/Coord';
import { Direction, AllDirections, Opposite } from '../coordinates/Direction';
import { Tile } from './Tile';
import { Entrance, TileLibrary } from './Rooms';
import { tileSize } from './Size';

export function IndexCoord(c: Coord) { return Index(c.x, c.y); }
export function Index(x: number, y: number) { return `${x}, ${y}`; }

export class Floor {
  constructor(public readonly name: string) { }

  private grid = new Map<string, Tile>();

  getCoord(c: Coord): Tile | undefined { return this.getTile(c.x, c.y); }
  getTile(x: number, y: number): Tile | undefined { return this.grid.get(Index(x, y)); }

  hasCoord(c: Coord): boolean { return this.hasTile(c.x, c.y); }
  hasTile(x: number, y: number): boolean { return this.grid.has(Index(x, y)); }

  setCoord(tile: Tile, c: Coord) { this.setTile(tile, c.x, c.y); }
  setTile(tile: Tile, x: number, y: number) {
    if (this.hasTile(x, y)) {
      alert("Already had a tile there!");
      throw "already had a tile!";
    }

    tile.x = x;
    tile.y = y;
    
    const tileCenter = Multiply(Add(tile.coord, { x: 0, y: 0 }), tileSize);
    console.log("tile center!", tileCenter);
    tile.info.items?.forEach(item =>{
    console.log("item " + item.name, item.position);
    item.position = Add(item.position, tileCenter);
    console.log("new position " + item.name, item.position);
    });

    this.grid.set(Index(x, y), tile);
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

    // Find possible tiles
    // TODO: Factor in floor (basement, attic, etc) and stuff.
    const matchingTiles = TileLibrary.filter(tile => tile.canPlace(neededDoors, neededWalls));

    // TODO: we should never CLOSE off the entire floor, E.G. you should always be able to have at least 1 open door on each floor.

    // Pick a random tile from the possible ones.
    if (!matchingTiles) { throw new Error("No valid tile can go there! Wow we should really fix that!"); }

    const newTile = matchingTiles[Math.floor(Math.random() * matchingTiles.length)].copy();

    // PICK items that apear

    // things can have like SHELVES/etc you need to search
    // things can be on the ground
    // rooms have affinities for certain items, but never GUARANTEED
    // E>G> Knife often found in Kitchens.
    
    this.setTile(newTile, x, y);
  }
}

export const FirstFloor = new Floor("Main Floor");
FirstFloor.setTile(Entrance.copy(), 0, 0);
