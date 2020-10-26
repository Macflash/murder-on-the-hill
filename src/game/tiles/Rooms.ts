import { purse, watch, table, CopyItem, curesedKnife, Item, GetItems, DrawItemToCtx } from '../items/Items';
import { Tile } from './Tile';
import { Floor } from './Floor';
import { UpdateFogCanvas } from '../hud/SightLines';
import { Coord } from '../coordinates/Coord';
import dining_room from "./../../images/rooms/BAD_COPIES/dining_room.jpg";
import kitchen from "./../../images/rooms/BAD_COPIES/kitchen.jpg";
import storeroom from "./../../images/rooms/BAD_COPIES/storeroom.jpg";
import patio from "./../../images/rooms/BAD_COPIES/patio.jpg";
import entrance from "./../../images/rooms/BAD_COPIES/entrance.jpg";

const Kitchen = new Tile({
  name: "KITCHEN",
  doors: ["TOP", "RIGHT"],
  image: kitchen,
});

const Patio = new Tile({
  name: "PATIO",
  doors: ["TOP", "LEFT", "BOTTOM"],
  image: patio,
});

const Storeroom = new Tile({
  name: "STOREROOM",
  doors: ["TOP"],
  image: storeroom,
});

const DiningRoom = new Tile({
  name: "DINING ROOM",
  doors: ["TOP", "RIGHT"],
  image: dining_room,
});

export const Entrance = new Tile({
  name: "Entrance",
  doors: ["TOP", "LEFT", "BOTTOM"],
  image: entrance,
});

const FourWay = new Tile({
  name: "Hallway",
  doors: ["TOP", "LEFT", "RIGHT", "BOTTOM"],
});


FourWay.info.items = [CopyItem(table)];
const TeeWay = new Tile({ name: "Hallway", doors: ["TOP", "LEFT", "RIGHT"] });
const Straight = new Tile({ name: "Straight", doors: ["TOP", "BOTTOM"] });

Straight.info.items = [CopyItem(purse)];

const LTurn = new Tile({ name: "Hallway", doors: ["TOP", "RIGHT"] });
//LTurn.info.items = [new BasicMonster()]; // THIS IS NOT HOW WE SHOULD DO IT. do this when FILLING THE TILE.

const RTurn = new Tile({ name: "Hallway", doors: ["TOP", "LEFT"] });
RTurn.info.items = [CopyItem(curesedKnife)]; // THIS IS NOT HOW WE SHOULD DO IT. do this when FILLING THE TILE.

const DeadEnd = new Tile({ name: "Closet", doors: ["TOP"] });
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
  ...AllWay(Kitchen),
  ...AllWay(Storeroom),
  ...AllWay(Patio),
  ...AllWay(DiningRoom),
];

function createCanvas(id: string) {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.id = "Canvas_FloorAndItems";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  })

  return {
    canvas,
    ctx: canvas.getContext("2d")!,
  };
}

const { canvas: tileCanvas, ctx: tileCtx } = createCanvas("Canvas_Floor");
const { canvas: sightCanvas, ctx: sightCtx } = createCanvas("Canvas_Sight");
document.body.append(tileCanvas);
document.body.append(sightCanvas);
var resultCanvas: HTMLCanvasElement;
var resultCtx: CanvasRenderingContext2D;

export function DoSightLineThing(player: Item, floor: Floor, center: Coord) {
  DrawAllRooms(floor, center);
  DrawAllItems(center); // this is wrong somehow
  DrawSightCanvas(player, floor, center);
  DrawResult();
}

export function DrawAllRooms(floor: Floor, center: Coord) {
  tileCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  floor.tiles.forEach(tile => {
    tile.drawToCanvas(tileCtx, center);
  });
}

export function DrawAllItems(center: Coord) {
  GetItems().forEach(item => {
    DrawItemToCtx(item, tileCtx, center);
  });
}

export function DrawSightCanvas(player: Item, floor: Floor, center: Coord) {
  UpdateFogCanvas(sightCtx, player, floor, center);
  sightCtx.filter = "blur(5px)";
}

export function DrawResult() {
  if (!resultCanvas) {
    resultCanvas = document.getElementById("Canvas_SightResult") as HTMLCanvasElement;
    if (!resultCanvas) { return; }
  }
  if (!resultCtx) {
    resultCtx = resultCanvas.getContext("2d")!;
    resultCtx.save();
  }

  resultCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  resultCtx.globalCompositeOperation = "source-over";
  resultCtx.restore();
  //resultCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  //resultCtx.fillStyle="white";
  //resultCtx.fillRect(0,0,window.innerWidth,window.innerHeight);
  resultCtx.drawImage(sightCanvas, 0, 0);
  resultCtx.globalCompositeOperation = "source-in";
  resultCtx.drawImage(tileCanvas, 0, 0);
}