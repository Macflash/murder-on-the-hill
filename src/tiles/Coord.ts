import { Direction } from './Direction';

export interface Coord {
  x: number;
  y: number;
}

export function MoveCoord(c: Coord, direction: Direction): Coord {
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

// Distances ordered by their stupidness
export function Distance(a: Coord, b:Coord) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function HammingDistance(a: Coord, b:Coord) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function EitherDirectionDistance(a: Coord, b:Coord) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}