import { GetTileTopAndLeft } from './GridTile';
import { Coord, MoveCoord } from '../coordinates/Coord';
import { Direction, Rotate } from '../coordinates/Direction';
import { Floor, TileCoord } from './Floor';
import { Item, CopyItem } from '../items/Items';
import { tileSize } from './Size';

interface TileInfo {
  name: string;

  doors: Direction[];

  image?: string;

  items?: Item[]; // These positions are in relative roomX, roomY.

  // is there only 1 copy or are there multiple? 
  // SHOULD we just have a stack of rooms and pick from them and take them out when we use them??
  copies?: boolean;
}

export class Tile {
  // Rotations RIGHT in 90 increments. 0-3;
  //public rotation = 0; // TODO
  public x = 0;
  public y = 0;
  public floor = 0;
  private initialDoors: Set<Direction>;
  private rotation = 0;
  private imageEl_: HTMLImageElement | null = null;

  constructor(public readonly info: TileInfo) {
    const { doors } = info;
    this.initialDoors = new Set<Direction>(doors);
  }

  get coord(): TileCoord {
    return { x: this.x, y: this.y, floor: this.floor };
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
      items: this.info.items?.map(item => CopyItem(item)), // this breaks monsters :(
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
    /*
    if (this.image) {
      // this doesn't handle ROTATION right. so we would need to create ANOTHER
      // canvas with the image and THEN rotate it.
      let im: HTMLImageElement | HTMLCanvasElement = this.image;
      
      /* OK, just need to... fix this some how... or have rotated image LOL.
      if (this.rotation) {
        const temp = document.createElement("canvas");
        temp.width = tileSize;
        temp.height = tileSize;
        const tc = temp.getContext("2d")!;
        tc.drawImage(this.image, 0, 0, tileSize, tileSize);
        tc.translate(-.5 * tileSize, -.5 * tileSize);
        console.log("ROTATIMG IMAGE!", this.rotation, Math.PI * this.rotation / 2);
        tc.rotate(Math.PI * this.rotation / 4);
        tc.translate(.5 * tileSize, .5 * tileSize);
        im = temp;
      }

      ctx.drawImage(im, topCorner.x, topCorner.y, tileSize, tileSize);
    }
    else { */
      ctx.fillStyle = "#663333"; // brown..ish?
      ctx.fillRect(topCorner.x - 1, topCorner.y - 1, tileSize + 2, tileSize + 2);
    //}
  }
}
