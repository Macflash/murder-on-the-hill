import { Tile } from './Tile';

export const FourWay = new Tile({ name: "Fourway", doors: ["TOP", "LEFT", "RIGHT", "BOTTOM"] });
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

export const TileLibrary = [
  ...TwoWay(FourWay),
  ...TwoWay(Straight),
  ...AllWay(TeeWay),
  ...AllWay(LTurn),
  ...AllWay(RTurn),
  ...AllWay(DeadEnd),
];
