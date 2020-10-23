// anything beyond this we don't need to render.

import { centerX, centerY } from "../App";
import { doorSize, tileViewDist, wallSize } from "../GridTile";
import { GetTileCoord, GetRoomCoord, CollideWithWalls } from "./Collision";
import { Coord, MoveCoord } from "./Coord";
import { Direction } from "./Direction";
import { Floor } from "./Floor";
import { Item } from "./Items";
import { tileSize } from "./Size";

// As long as we factor in their size as well...
export const sightDistance = 400;

var fog: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
window.addEventListener('resize', () => {
    fog.width = window.innerWidth;
    fog.height = window.innerHeight;
    //UpdateFog();
});

// terrible stripped down version of the actual collide item with wall function
export function IsInWall(c: Coord, floor?: Floor) {
    const hT = .5 * tileSize;
    const hW = 1;
    const hH = 1;
    const hD = .5 * doorSize;

    const hDX = hD - hW;
    const hDY = hD - hH;

    // which TILE is it in?

    const tileCoord = GetTileCoord(c);
    const { x: roomX, y: roomY } = GetRoomCoord({ position: c } as Item, tileCoord);

    const leftWall = hW + wallSize - hT;
    const rightWall = -1 * leftWall;
    const topWall = hH + wallSize - hT;
    const bottomWall = -1 * topWall;

    const tile = floor?.getCoord(tileCoord);

    //hasDoor={tile.doors.has(d)}
    //opened={tile.hasNeighbor(floor, d)}

    function HasRoom(coord: Coord, direction: Direction) {
        const hasDoor = tile && tile.doors.has(direction);

        if (!hasDoor) { return false; }

        const newCoord = MoveCoord(coord, direction);
        return floor?.hasCoord(newCoord);
    }

    // TODO: Stop weirdness at the EDGE of doors.

    // If you are inside the wall boundary
    if (roomX <= leftWall) {
        // AND you are outside of the door area (or there is no door):
        // Push you back to the edge of the wall.
        if (Math.abs(roomY) > hDY || !HasRoom(tileCoord, "LEFT")) {
            return true;
        }
    }
    if (roomX >= rightWall) {
        if (Math.abs(roomY) > hDY || !HasRoom(tileCoord, "RIGHT")) {
            return true;
        }
    }
    if (roomY <= topWall) {
        if (Math.abs(roomX) > hDX || !HasRoom(tileCoord, "TOP")) {
            return true;
        }
    }
    if (roomY >= bottomWall) {
        if (Math.abs(roomX) > hDX || !HasRoom(tileCoord, "BOTTOM")) {
            return true;
        }
    }

    // tile
}


/** Returns where this hits a wall! */
const rayStep = wallSize;
var rayLength = 10 + tileViewDist * tileSize / rayStep; //was like 75 or 100;
console.log("ray length", rayLength);
window.addEventListener('resize', () => {
    rayLength = 10 + tileViewDist * tileSize / rayStep;
    console.log("ray length", rayLength);
});
// 20 is ok, 60 is good, 
const angleSize = Math.PI / 100;

// dude you could probably just CALCULATE (DO the math bro! it's faster) the next time the ray would = .5 tilesize  % tilesize
export function shootRay(start: Coord, stepVector: Coord, floor: Floor): Coord {
    // assume vector is the RIGHT length
    let length = 0;
    let ray = { x: start.x, y: start.y };
    while (!CollideWithWalls({ position: ray, height: 1, width: 1, velocity: { x: 0, y: 0 } } as Item, floor)
        && length < rayLength) {
        ray.x += stepVector.x;
        ray.y += stepVector.y;
        length++;
    }

    return ray;
}
// PI/10 is clunky, PI/20 is pretty dang smooth.
export function shootRaysInCircle(start: Coord, floor: Floor) {
    const points: Coord[] = [];
    let angle = 0;
    while (angle < Math.PI * 2) {
        points.push(shootRay(start, {
            x: Math.cos(angle) * rayStep,
            y: Math.sin(angle) * rayStep,
        }, floor));
        angle += angleSize;
    }
    return points;
}

function toScreenSpot(c: Coord): Coord {
    return {
        x: c.x - centerX + (.5 * window.innerWidth),
        y: c.y - centerY + (.5 * window.innerHeight),
    }
}

export function UpdateFog(player: Item, floor: Floor) {

    if (!ctx) {
        fog = document.getElementById("fog") as HTMLCanvasElement;
        if (!fog) { return; }
        fog.width = window.innerWidth;
        fog.height = window.innerHeight;

        ctx = fog.getContext("2d")!;
        if (!ctx) { return; }
    }

    //fog.style.opacity = ".5";
    ctx.clearRect(0, 0, fog.width, fog.height);

    const rayPoints = shootRaysInCircle(player.position, floor);

    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "1px yellow";
    ctx.beginPath();
    const playerCoord = toScreenSpot(player.position);
    ctx.moveTo(playerCoord.x, playerCoord.y);
    rayPoints.forEach(point => {
        const p = toScreenSpot(point);
        ctx.lineTo(p.x, p.y);
    });
    const p = toScreenSpot(rayPoints[0]);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.fill();

    // draw LINES to the wall edge. E.G.
    // we need the player spot and the WALL corners.

}

function sourceInTest() {
    // TEST ONLY

    /*
    This would be  the HTML to add in the app:
     <canvas id="canvas_map"
              width={window.innerWidth}
              height={window.innerHeight}
              style={canvasStyle} />
              <canvas id="canvas_sightlines"
                 width={window.innerWidth}
                 height={window.innerHeight}
                 style={canvasStyle} />
                 <canvas id="canvas_result"
                    width={window.innerWidth}
                    height={window.innerHeight}
                    style={canvasStyle} />
    */
    const sightCv = document.getElementById("canvas_sightlines") as HTMLCanvasElement;
    const mapCv = document.getElementById("canvas_map") as HTMLCanvasElement;
    const resultCv = document.getElementById("canvas_result") as HTMLCanvasElement;

    if (!sightCv) { return; }

    const sight_ctx = sightCv.getContext("2d")!;
    const map_ctx = mapCv.getContext("2d")!;
    const result_ctx = resultCv.getContext("2d")!;

    // draw a "map tile"
    map_ctx.fillStyle = "grey";
    map_ctx.fillRect(window.innerWidth / 2 - 200, window.innerHeight / 2 - 200, 400, 400);
    map_ctx.fillStyle = "#442222";
    map_ctx.fillRect(window.innerWidth / 2 - 150, window.innerHeight / 2 - 150, 300, 300);

    // draw the "sight line"

    sight_ctx.fillStyle = "yellow";
    sight_ctx.strokeStyle = "1px solid yellow";
    sight_ctx.beginPath();
    sight_ctx.moveTo(window.innerWidth / 2, window.innerHeight / 2);
    sight_ctx.lineTo(200, 200);
    sight_ctx.fill();
    sight_ctx.lineTo(200, 400);
    sight_ctx.fill();
    sight_ctx.lineTo(window.innerWidth / 2, window.innerHeight / 2);
    sight_ctx.arc(window.innerWidth / 2, window.innerHeight / 2, 100, 0, Math.PI * 2)
    sight_ctx.fill();
    sight_ctx.stroke();
    //sight_ctx.fillRect(window.innerWidth / 2-100, window.innerHeight / 2-100, 200,200);

    // create the result
    result_ctx.drawImage(sightCv, 0, 0);
    result_ctx.globalCompositeOperation = "source-in";
    result_ctx.drawImage(mapCv, 0, 0);

    // hide the other canvases

    sightCv.style.display = "none";
    mapCv.style.display = "none";


    // END TEST
}