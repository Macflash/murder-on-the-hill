
// ok how can we do... intersections and interactions?
// #1 only can hit things in your room (or very rarely a neighboring room that is close by..)

import { Coord, Distance, MoveCoord } from "../coordinates/Coord";
import { Direction } from "../coordinates/Direction";
import { Floor } from "../tiles/Floor";
import { GetItems, Item, RectangleCollision } from "./Items";
import { doorSize, wallSize, tileSize } from "../tiles/Size";
import { Tile } from "../tiles/Tile";

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

export function GetWallCorners() {
    // ray trace to all of these basically?
}

export function HasRoomOrCreate(floor: Floor | undefined, tile: Tile | undefined, coord: Coord, direction: Direction, create: boolean) {
    const hasDoor = tile && tile.doors.has(direction);

    if (!hasDoor) { return false; }

    const newCoord = MoveCoord(coord, direction);
    if (!floor?.hasCoord(newCoord)) {
        if (create) {
            floor?.fillCoord(newCoord);
        }
        else {
            return false;
        }
    }

    return true;
}

export function HasDoor(tile: Tile | undefined, direction: Direction) {
    return tile && tile.doors.has(direction);
}

export function CreateRoomIfNeeded(floor: Floor | undefined, coord: Coord, direction: Direction) {
    const newCoord = MoveCoord(coord, direction);
    if (!floor?.hasCoord(newCoord)) {
        floor?.fillCoord(newCoord);
    }
}

export function CollideWithWalls(item: Item, floor?: Floor, createOnDoor = false): boolean {
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

    let collisionTrue = false;
    // If you are inside the wall boundary
    if (roomX <= leftWall) {
        // AND you are outside of the door area (or there is no door):
        // Push you back to the edge of the wall.
        const hasDoor = hasDoorAndOpenIfNeeded_New("LEFT", tile, roomY, hDY, hH, createOnDoor, floor);
        if (Math.abs(roomY) > hDY || !hasDoor) {
            if (hasDoor && Math.abs(roomY) < hDY + doorEdgeSize) {
                // so we know you are within the range of the door.
                // so we want to push you BACK towards the center
                if (roomY > 0) {
                    item.position.y += hDY - roomY;
                }
                else {
                    item.position.y -= hDY + roomY;
                }
                item.velocity.y = 0;
                return true;
            }

            item.position.x += leftWall - roomX;
            item.velocity.x = 0;
            collisionTrue = true;
        }
    }
    if (roomX >= rightWall) {
        const hasDoor = hasDoorAndOpenIfNeeded_New("RIGHT", tile, roomY, hDY, hH, createOnDoor, floor);
        if (Math.abs(roomY) > hDY || !hasDoor) {
            if (hasDoor && Math.abs(roomY) < hDY + doorEdgeSize) {
                // so we know you are within the range of the door.
                // so we want to push you BACK towards the center
                if (roomY > 0) {
                    item.position.y += hDY - roomY;
                }
                else {
                    item.position.y -= hDY + roomY;
                }
                item.velocity.y = 0;
                return true;
            }

            item.position.x += rightWall - roomX;
            item.velocity.x = 0;
            collisionTrue = true;
        }
    }
    if (roomY <= topWall) {
        const hasDoor = hasDoorAndOpenIfNeeded_New("TOP", tile, roomX, hDX, hW, createOnDoor, floor);
        if (Math.abs(roomX) > hDX || !hasDoor) {
            if (hasDoor && Math.abs(roomX) < hDX + doorEdgeSize) {
                // so we know you are within the range of the door.
                // so we want to push you BACK towards the center
                if (roomX > 0) {
                    item.position.x += hDX - roomX;
                }
                else {
                    item.position.x -= hDX + roomX;
                }
                item.velocity.x = 0;
                return true;
            }

            item.position.y += topWall - roomY;
            item.velocity.y = 0;
            collisionTrue = true;
        }
    }
    if (roomY >= bottomWall) {
        const hasDoor = hasDoorAndOpenIfNeeded_New("BOTTOM", tile, roomX, hDX, hW, createOnDoor, floor);
        if (Math.abs(roomX) > hDX || !hasDoor) {
            if (hasDoor && Math.abs(roomX) < hDX + doorEdgeSize) {
                // so we know you are within the range of the door.
                // so we want to push you BACK towards the center
                if (roomX > 0) {
                    item.position.x += hDX - roomX;
                }
                else {
                    item.position.x -= hDX + roomX;
                }
                item.velocity.x = 0;
                return true;
            }

            item.position.y += bottomWall - roomY;
            item.velocity.y = 0;
            collisionTrue = true;
        }
    }

    return collisionTrue;
}

// TODO: auto refactor gave these variables TRASH names.
function hasDoorAndOpenIfNeeded_New(
    direction: Direction,
    tile: Tile | undefined,
    roomY: number,
    hDY: number,
    hH: number,
    createOnDoor: boolean,
    floor: Floor | undefined,
) {
    const hasDoor = HasDoor(tile, direction);
    if (Math.abs(roomY) <= (hDY + hH + 5) && hasDoor && createOnDoor) {
        CreateRoomIfNeeded(floor, tile!, direction);
    }
    return hasDoor;
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

// TODO: this doesn't actually separate the items...
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
    // How can we do that? Ideally we would like factor in the faces,d but for laziness
    // we could just push opposite the direction?
    a.velocity.x = x;
    a.velocity.y = y;
    b.velocity.x = x;
    b.velocity.y = y;
}

export const InteractionRange = 5;
export function GetItemsInInteractionDistance(player: Item, items: Item[]) {
    return items.filter((item, i) => {
        if (Distance(player.position, item.position) < InteractionRange + .4 * (item.width + item.height + player.width + player.height)) {
            // how do we want to handle multiple items?
            return true;
        }

        return false;
    });
}

function UnmoveableCollision(moveable: Item, unmoveable: Item) {
    const overlapX = .5 * (moveable.width + unmoveable.width) - Math.abs(moveable.position.x - unmoveable.position.x);
    const overlapY = .5 * (moveable.height + unmoveable.height) - Math.abs(moveable.position.y - unmoveable.position.y);

    // Use whichever overlap is smalelr inorder to resolve the collision.
    if (overlapX <= overlapY) {
        // just do that one!
        if (moveable.position.x < unmoveable.position.x) {
            moveable.position.x -= overlapX;
            moveable.velocity.x = -overlapX; // LOL, the bounce is kind of fun. This should really be 0 for inelastic collision.
        }
        else {
            moveable.position.x += overlapX;
            moveable.velocity.x = overlapX;
        }
    }
    else {
        // just do that one!
        if (moveable.position.y < unmoveable.position.y) {
            moveable.position.y -= overlapY;
            moveable.velocity.y = -overlapY;
        }
        else {
            moveable.position.y += overlapY;
            moveable.velocity.y = overlapY;
        }
    }
}

let max_objects_collided = 0;
export function CollideItems(players: Item[]) {
    const items = [...players, ...GetItems()].filter(items => items.blockObjects || items.moveable);
    if (items.length > max_objects_collided) {
        console.log(`checking collisions for ${items.length} items`);
        max_objects_collided = items.length;
    }
    //console.log("checking collisions for ", items.length);
    items.forEach((item, i) => {
        if (i < items.length - 1) {
            for (let j = i + 1; j < items.length; j++) {
                if (RectangleCollision(item, items[j])) {
                    const item_unmoveable = item.blockObjects && !item.moveable;
                    const other_unmoveable = items[j].blockObjects && !items[j].moveable
                    if (item_unmoveable && !other_unmoveable) {
                        UnmoveableCollision(items[j], item);
                    }
                    else if (!item_unmoveable && other_unmoveable) {
                        UnmoveableCollision(item, items[j]);
                    }
                    // enable once NOT TERRIBLE InelasticCollision(item, items[j]);
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