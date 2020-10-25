import { centerX, centerY } from "../../App";
import { tileSize, wallSize } from "../tiles/Size";
import { CollideWithWalls } from "../items/Collision";
import { Coord } from "../coordinates/Coord";
import { Floor } from "../tiles/Floor";
import { Item } from "../items/Items";

// As long as we factor in their size as well...
export const sightDistance = 400;
function GetTileViewDist(){
    var screenSize = Math.max(window.innerWidth, window.innerHeight);
    return Math.ceil(screenSize / (2 * tileSize));
}

var viewDist = GetTileViewDist();

/*
var fog: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
window.addEventListener('resize', () => {
    if(!fog){ return; }
    fog.width = window.innerWidth;
    fog.height = window.innerHeight;
    //UpdateFog();
});
*/

/** Returns where this hits a wall! */
const rayStep = wallSize;
var rayLength = 10 + viewDist * tileSize / rayStep; //was like 75 or 100;
console.log("ray length", rayLength);
window.addEventListener('resize', () => {
    rayLength = 10 + viewDist * tileSize / rayStep;
    console.log("ray length", rayLength);
});
// 20 is ok, 60 is good, 120 is REAL fine. 200 cant really tell the difference.
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

export function toScreenSpot(c: Coord): Coord {
    return {
        x: c.x - centerX + (.5 * window.innerWidth),
        y: c.y - centerY + (.5 * window.innerHeight),
    }
}

/*
export function UpdateFog(player: Item, floor: Floor) {
    if (!ctx) {
        fog = document.getElementById("fog") as HTMLCanvasElement;
        if (!fog) { return; }
        fog.width = window.innerWidth;
        fog.height = window.innerHeight;

        ctx = fog.getContext("2d")!;
        if (!ctx) { return; }
    }
    UpdateFogCanvas(ctx, player, floor);
}*/

export function UpdateFogCanvas(ctx: CanvasRenderingContext2D, player: Item, floor: Floor) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const rayPoints = shootRaysInCircle(player.position, floor);
    const ps = toScreenSpot(player.position);
    const gradient = ctx.createRadialGradient(ps.x, ps.y,70, ps.x, ps.y, viewDist * tileSize);
    gradient.addColorStop(0, "lightyellow");
    gradient.addColorStop(.07, "rgba(255,255,0,1)");
    gradient.addColorStop(.2, "rgba(255,255,0,.8)");
    gradient.addColorStop(1, "rgba(255,128,0,0)");

    ctx.fillStyle = gradient; // "lightyellow";
    ctx.strokeStyle = "1px lightyellow";
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
}