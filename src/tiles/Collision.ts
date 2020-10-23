
// ok how can we do... intersections and interactions?
// #1 only can hit things in your room (or very rarely a neighboring room that is close by..)

import { doorSize, wallSize } from "../GridTile";
import { Coord, MidPoint, MoveCoord } from "./Coord";
import { Direction } from "./Direction";
import { Floor } from "./Floor";
import { GetItems, Item, RectangleCollision } from "./Items";
import { tileSize } from "./Size";

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

const doorEdgeSize = 3;

export function CollideWithWalls(item: Item, floor?: Floor) {
    const hT = .5 * tileSize;
    const hW = .5 * item.width;
    const hH = .5 * item.height;
    const hD = .5 * doorSize;

    const hDX = hD - hW;
    const hDY = hD - hH;

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

    // TODO: Stop weirdness at the EDGE of doors.

    // If you are inside the wall boundary
    if (roomX <= leftWall) {
        // AND you are outside of the door area (or there is no door):
        // Push you back to the edge of the wall.
        if (Math.abs(roomY) > hDY || !HasRoomOrCreate(tileCoord, "LEFT")) {
            if (Math.abs(roomY) < hDY + doorEdgeSize) {
                // so we know you are within the range of the door.
                // so we want to push you BACK towards the center
                if(roomY > 0){
                    item.position.y += hDY - roomY;
                }
                else {
                    item.position.y -= hDY + roomY;
                }
                item.velocity.y = 0;
                return;
            }

            item.position.x += leftWall - roomX;
            item.velocity.x = 0;
        }
    }
    if (roomX >= rightWall) {
        if (Math.abs(roomY) > hDY || !HasRoomOrCreate(tileCoord, "RIGHT")) {
            if (Math.abs(roomY) < hDY + doorEdgeSize) {
                // so we know you are within the range of the door.
                // so we want to push you BACK towards the center
                if(roomY > 0){
                    item.position.y += hDY - roomY;
                }
                else {
                    item.position.y -= hDY + roomY;
                }
                item.velocity.y = 0;
                return;
            }

            item.position.x += rightWall - roomX;
            item.velocity.x = 0;
        }
    }
    if (roomY <= topWall) {
        if (Math.abs(roomX) > hDX || !HasRoomOrCreate(tileCoord, "TOP")) {
            if (Math.abs(roomX) < hDX + doorEdgeSize) {
                // so we know you are within the range of the door.
                // so we want to push you BACK towards the center
                if(roomX > 0){
                    item.position.x += hDX - roomX;
                }
                else {
                    item.position.x -= hDX + roomX;
                }
                item.velocity.x = 0;
                return;
            }

            item.position.y += topWall - roomY;
            item.velocity.y = 0;
        }
    }
    if (roomY >= bottomWall) {
        if (Math.abs(roomX) > hDX || !HasRoomOrCreate(tileCoord, "BOTTOM")) {
            if (Math.abs(roomX) < hDX + doorEdgeSize) {
                // so we know you are within the range of the door.
                // so we want to push you BACK towards the center
                if(roomX > 0){
                    item.position.x += hDX - roomX;
                }
                else {
                    item.position.x -= hDX + roomX;
                }
                item.velocity.x = 0;
                return;
            }
            
            item.position.y += bottomWall - roomY;
            item.velocity.y = 0;
        }
    }

    // tile
}

export function ApplyFriction(players: Item[]) {
    const items = [...players, ...GetItems()];
    items.forEach(item => {
        if (item.velocity) {
            if (item.velocity.x) {
                item.velocity.x *= .9;
                if (Math.abs(item.velocity.x) < .1) { item.velocity.x = 0; }
            }
            if (item.velocity.y) {
                item.velocity.y *= .9;
                if (Math.abs(item.velocity.y) < .1) { item.velocity.y = 0; }
            }
        }
    });
}

export function InelasticCollision(a: Item, b: Item) {
    // final velocity
    const x = (a.mass * a.velocity.x + b.mass * b.velocity.x) / (a.mass + b.mass);
    const y = (a.mass * a.velocity.y + b.mass * b.velocity.y) / (a.mass + b.mass);

    // step back their velocities a bit??

    const fudge = .2;
    a.position.x -= a.velocity.x * fudge;
    a.position.y -= a.velocity.y * fudge;
    b.position.x -= b.velocity.x * fudge;
    b.position.y -= b.velocity.y * fudge;

    // and we want to PUSH them out so they are not colliding.
    // How can we do that? Ideally we would like factor in the faces, but for laziness
    // we could just push opposite the direction?
    a.velocity.x = x;
    a.velocity.y = y;
    b.velocity.x = x;
    b.velocity.y = y;
}

export function CollideItems(players: Item[]) {
    const items = [...players, ...GetItems()];
    items.forEach((item, i) => {
        if (i < items.length - 1) {
            for (let j = i + 1; j < items.length; j++) {
                if (RectangleCollision(item, items[j])) {
                    //console.log("COLLISION!", item.name, items[j].name);
                    // TODO: update velocity and stuff??
                    InelasticCollision(item, items[j]);
                }
            }
        }
    });
}

export function MoveItems(players: Item[]) {
    const items = [...players, ...GetItems()];
    items.forEach((item, i) => {
        if (item.velocity.x) {
            item.position.x += item.velocity.x;
        }
        if (item.velocity.y) {
            item.position.y += item.velocity.y;
        }
    });
}