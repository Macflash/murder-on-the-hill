export type Direction = "TOP" | "LEFT" | "RIGHT" | "BOTTOM";

export function AllDirections(): Direction[] {
  return ["TOP", "RIGHT", "BOTTOM", "LEFT"];
}

export function Opposite(direction: Direction): Direction {
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

export function Rotate(direction: Direction, rotation: number) {
  const allDirections = AllDirections();
  const index = allDirections.indexOf(direction);
  return allDirections[(index + rotation) % allDirections.length];
}
