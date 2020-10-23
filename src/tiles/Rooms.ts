import { purse, watch,table, CopyItem, curesedKnife } from './Items';
import { Tile } from './Tile';

export const FourWay = new Tile({ name: "Fourway", doors: ["TOP", "LEFT", "RIGHT", "BOTTOM"] });
FourWay.info.items = [CopyItem(table)];
const TeeWay = new Tile({ name: "TeeWay", doors: ["TOP", "LEFT", "RIGHT"] });
const Straight = new Tile({ name: "Straight", doors: ["TOP", "BOTTOM"] });

Straight.info.items = [CopyItem(purse)];

const LTurn = new Tile({ name: "LTurn", doors: ["TOP", "RIGHT"] });
const RTurn = new Tile({ name: "RTurn", doors: ["TOP", "LEFT"] });
RTurn.info.items = [CopyItem(curesedKnife)]; // THIS IS NOT HOW WE SHOULD DO IT. do this when FILLING THE TILE.

const DeadEnd = new Tile({ name: "DeadEnd", doors: ["TOP"] });
DeadEnd.info.items = [CopyItem(watch)]; // THIS IS NOT HOW WE SHOULD DO IT. do this when FILLING THE TILE.

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
