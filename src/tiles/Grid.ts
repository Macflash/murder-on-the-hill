import { Coord } from "./Coord";

export function Index(c: Coord) { return `${c.x}, ${c.y}`; }

// Generic grid for getting/setting things by Tile Coordinates
export class Grid<T> {
    constructor() { }
  
    private grid = new Map<string, T>();
  
    get(c: Coord): T | undefined { return this.grid.get(Index(c)); }
  
    has(c: Coord): boolean { return this.grid.has(Index(c)); }
  
    set(c: Coord, entry: T) { 
      this.grid.set(Index(c), entry);
    }
  
    get entries(): T[] {
      return Array.from(this.grid, ([, entry]) => entry);
    }
  }

  export class ListGrid<T> {
    constructor() { }
  
    private grid = new Grid<T[]>();
  
    get(c: Coord): T[] { return this.grid.get(c) || []; }
  
    has(c: Coord): boolean { return !!this.grid.get(c)?.length; }
  
    // todo: how to manage moving items between cells, and how should we update them???
  
    get entries(): T[] {
        const entries: T[] = [];
        this.grid.entries.forEach(list => entries.push(...list));
        return entries;
    }
  }