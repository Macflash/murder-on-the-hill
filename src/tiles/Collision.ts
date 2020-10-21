
// ok how can we do... intersections and interactions?
// #1 only can hit things in your room (or very rarely a neighboring room that is close by..)

import { doorSize, wallSize } from "../GridTile";
import { Coord, MoveCoord } from "./Coord";
import { Direction } from "./Direction";
import { Floor } from "./Floor";
import { tileSize } from "./Size";

export interface Item {
    position: Coord,
    height: number,
    width: number,

    //    movable?: boolean, // can it be pushed?
    //mass?: number, // how heavy is it?

    // Oh? What, you didn't think we would do PHYSICS?
    // Fuck yeah we will.
    //speedX: number,
    //speedY: number,
}

var items: Item[] = [];
// yo if we stored these BY room it would be pretty cool.

export function AddItem(item: Item) {
    items.push(item);
}

/** The TILE the item is in. */
export function GetTileCoord(c: Coord): Coord {
    const hT = .5 * tileSize;
    const x = Math.floor((c.x + hT) / tileSize);
    const y = Math.floor((c.y + hT) / tileSize);
    return { x, y };
}

/** The relative place in the current TILE the item is in. */
export function GetRoomCoord(item: Item, tileCoord: Coord): Coord {
    const x = item.position.x - (tileCoord.x * tileSize);
    const y = item.position.y - (tileCoord.y * tileSize);
    return { x, y };
}

export function CollidePlayerWithWalls(item: Item, floor?: Floor) {
    const hT = .5 * tileSize;
    const hW = .5 * item.width;
    const hH = .5 * item.height;
    const hD = .5 * doorSize;

    // which TILE is it in?

    const tileCoord = GetTileCoord(item.position);
    const { x: roomX, y: roomY } = GetRoomCoord(item, tileCoord);

    const leftWall = hW + wallSize - hT;
    const rightWall = -1 * leftWall;
    const topWall = hH + wallSize - hT;
    const bottomWall = -1 * topWall;

    const tile = floor?.getCoord(tileCoord);

    //hasDoor={tile.doors.has(d)}
    //opened={tile.hasNeighbor(floor, d)}

    function HasRoomOrCreate(coord: Coord, direction: Direction) {
        const hasDoor = tile && tile.doors.has(direction);

        if (!hasDoor) { return false; }

        const newCoord = MoveCoord(coord, direction);
        if (!floor?.hasCoord(newCoord)) {
            floor?.fillCoord(newCoord);
        }

        return true;
    }

    // TODO: stop the item's actual move speed too.
    // TODO: Stop weirdness at the EDGE of doors.
    if (roomX <= leftWall) {
        if (Math.abs(roomY) > hD || !HasRoomOrCreate(tileCoord, "LEFT")) {
            item.position.x += leftWall - roomX;
        }
    }
    if (roomX >= rightWall) {
        if (Math.abs(roomY) > hD || !HasRoomOrCreate(tileCoord, "RIGHT")) {
            item.position.x += rightWall - roomX;
        }
    }
    if (roomY <= topWall) {
        if (Math.abs(roomX) > hD || !HasRoomOrCreate(tileCoord, "TOP")) {
            item.position.y += topWall - roomY;
        }
    }
    if (roomY >= bottomWall) {
        if (Math.abs(roomX) > hD || !HasRoomOrCreate(tileCoord, "BOTTOM")) {
            item.position.y += bottomWall - roomY;
        }
    }

    // tile
}