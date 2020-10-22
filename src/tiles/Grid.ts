import { Coord } from "./Coord";

export function Index(c: Coord) { return `${c.x}, ${c.y}`; }

// Generic grid for getting/setting things by Tile Coordinates
export class Grid<T> {
    constructor() { }
  
    private grid = new Map<string, T>();
  
    getCoord(c: Coord): T | undefined { return this.grid.get(Index(c)); }
  
    has(c: Coord): boolean { return this.grid.has(Index(c)); }
  
    set(c: Coord, entry: T) { 
      this.grid.set(Index(c), entry);
    }
  
    get entries(): T[] {
      return Array.from(this.grid, ([, entry]) => entry);
    }
  }