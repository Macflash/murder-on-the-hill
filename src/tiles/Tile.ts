import { centerX, centerY } from '../App';
import { GetTileTopAndLeft } from '../GridTile';
import { Coord, MoveCoord } from './Coord';
import { Direction, Rotate } from './Direction';
import { Floor } from './Floor';
import { Item, CopyItem } from './Items';
import { tileSize } from './Size';

interface TileInfo {
  name: string;

  doors: Direction[];

  image?: string;

  items?: Item[]; // These positions are in relative roomX, roomY.
}

export class Tile {
  // Rotations RIGHT in 90 increments. 0-3;
  //public rotation = 0; // TODO
  public x = 0;
  public y = 0;
  private initialDoors: Set<Direction>;
  private rotation = 0;
  private imageEl_: HTMLImageElement | null = null;

  constructor(public readonly info: TileInfo) {
    const { doors } = info;
    this.initialDoors = new Set<Direction>(doors);
  }

  get coord(): Coord {
    return { x: this.x, y: this.y };
  }

  get doors(): Set<Direction> {
    const rotatedDoors = new Set<Direction>();
    this.initialDoors.forEach(door => { rotatedDoors.add(Rotate(door, this.rotation)); });
    return rotatedDoors;
  }

  /** Return valid rotations for the tile to be placed in a spot with the given constraints. */
  // TODO: Handle ROTATION PROBABLY!
  canPlace(neededDoors: Set<Direction>, neededWalls: Set<Direction>): boolean {
    // TODO: Wait what about WALLS where we SHOULDNT have doors!
    // ensure all needed doors are there
    let canPlace = true;
    neededDoors.forEach(direction => {
      if (!this.doors.has(direction)) {
        canPlace = false;
      }
    });

    // ensure all needed walls have no doors!
    neededWalls.forEach(direction => {
      if (this.doors.has(direction)) {
        canPlace = false;
      }
    });

    return canPlace;
  }

  copy(r?: number) {
    const t = new Tile({
      ...this.info,
      items: this.info.items?.map(item => CopyItem(item)),
    });
    if (r) {
      t.rotate(r);
    }
    else {
      t.rotate(this.rotation);
    }
    return t;
  }

  rotate(r: number) {
    this.rotation = r % 4;
    return this;
  }

  hasNeighbor(floor: Floor, direction: Direction): boolean {
    // let neightbor: boolean; // Later we might want to be able to "CLOSE" doors again? skip for now.
    return floor.hasCoord(MoveCoord(this.coord, direction));
  }

  get image() {
    if (this.imageEl_) { return this.imageEl_; }
    if (!this.info.image) { return null; }
    this.imageEl_ = document.createElement("img");
    this.imageEl_.width = tileSize;
    this.imageEl_.height = tileSize;
    this.imageEl_.src = this.info.image;
  }

  drawToCanvas(ctx: CanvasRenderingContext2D, center: Coord) {
    const topCorner = GetTileTopAndLeft(this.coord, center);
    if (this.image) {
      ctx.drawImage(this.image, topCorner.x, topCorner.y);
    }
    else {
      ctx.fillStyle = "#663333"; // brown..ish?
      ctx.fillRect(topCorner.x-1, topCorner.y-1, tileSize+2, tileSize+2);
    }
  }
}
