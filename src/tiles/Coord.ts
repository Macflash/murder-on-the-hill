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
