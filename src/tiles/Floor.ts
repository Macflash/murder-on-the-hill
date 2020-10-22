import { Coord, MoveCoord } from './Coord';
import { Direction, AllDirections, Opposite } from './Direction';
import { Tile } from './Tile';
import { TileLibrary, FourWay } from './RegisterTiles';

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

    // Find possible tiles
    // TODO: Factor in floor type and stuff.
    const matchingTiles = TileLibrary.filter(tile => tile.canPlace(neededDoors, neededWalls));

    // Pick a random tile from the possible ones.
    if (!matchingTiles) { throw "wow we should really fix that!"; }

    const newTile = matchingTiles[Math.floor(Math.random() * matchingTiles.length)].copy();
    this.setTile(newTile, x, y);
  }
}

export const FirstFloor = new Floor("Main Floor");
FirstFloor.setTile(FourWay.copy(), 0, 0);
