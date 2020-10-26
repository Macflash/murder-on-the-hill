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

export function MidPoint(a: Coord, b: Coord) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

// Basic vector ops
export function Copy(a: Coord) {
  return {
    x: (a.x),
    y: (a.y),
  };
}

export function Add(a: Coord, b: Coord) {
  return {
    x: (a.x + b.x),
    y: (a.y + b.y),
  };
}

export function Subtract(a: Coord, b: Coord) {
  return {
    x: (a.x - b.x),
    y: (a.y - b.y),
  };
}

export function Multiply(a: Coord, b: number) {
  return {
    x: (a.x * b),
    y: (a.y * b),
  };
}

export function Divide(a: Coord, b: number) {
  return {
    x: (a.x / b),
    y: (a.y / b),
  };
}

// Vector direction and scaling ops
export function Magnitude(a: Coord) {
  return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
}

export function MakeUnitVector(a: Coord) {
  return Divide(a, Magnitude(a));
}

// Distances ordered by their stupidness
export function Distance(a: Coord, b: Coord) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function HammingDistance(a: Coord, b: Coord) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function EitherDirectionDistance(a: Coord, b: Coord) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

// Screen things
export function toScreenSpot(c: Coord, center: Coord): Coord {
  return {
      x: c.x - center.x + (.5 * window.innerWidth),
      y: c.y - center.y + (.5 * window.innerHeight),
  }
}