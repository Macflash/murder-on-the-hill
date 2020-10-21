
// ok how can we do... intersections and interactions?
// #1 only can hit things in your room (or very rarely a neighboring room that is close by..)

import { tileSize } from "../App";
import { wallSize } from "../GridTile";
import { Coord } from "./Coord";

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

export function CollidePlayerWithWalls(item: Item) {
    const tileX = item.position.x % tileSize;
    const tileY = item.position.y % tileSize;

    console.log("Player position in Tile", tileX, tileY);
    const hT = .5 * tileSize;
    const hW = .5 * item.width;
    const hH = .5 * item.height;
    const leftWall = hW + wallSize - hT;
    const rightWall =  -1 * leftWall;
    
    const topWall = hH + wallSize - hT;
    const bottomWall =  -1 * topWall;

    // TODO: stop the item's actual move speed too.
    if (tileX <= leftWall) {
        item.position.x += leftWall - tileX;
    }
    if (tileX >= rightWall) {
        item.position.x += rightWall - tileX;
    }
    if (tileY <= topWall) {
        item.position.y += topWall - tileY;
    }
    if (tileY >= bottomWall) {
        item.position.y += bottomWall - tileY;
    }
}