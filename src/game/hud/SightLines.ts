import { tileSize, wallSize } from "../tiles/Size";
import { CollideWithWalls } from "../items/Collision";
import { Coord, toScreenSpot } from "../coordinates/Coord";
import { Floor } from "../tiles/Floor";
import { Item } from "../items/Items";

// As long as we factor in their size as well...
export const sightDistance = 400;
function GetTileViewDist(){
    var screenSize = Math.max(window.innerWidth, window.innerHeight);
    return Math.ceil(screenSize / (2 * tileSize));
}

var viewDist = GetTileViewDist();

/** Returns where this hits a wall! */
const rayStep = wallSize;
var rayLength = 10 + viewDist * tileSize / rayStep; //was like 75 or 100;
window.addEventListener('resize', () => {
    rayLength = 10 + viewDist * tileSize / rayStep;
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
    // too jittery lol
    //const startAngle = Math.random() * angleSize;
    let angle = 0;
    while (angle < (Math.PI * 2)) {
        // yo we should do a ROOM AWARE version, like make the box THE ROOM,
        // and only cast a CONE through door ways.l
        points.push(shootRay(start, {
            x: Math.cos(angle) * rayStep,
            y: Math.sin(angle) * rayStep,
        }, floor));
        angle += angleSize;
    }
    return points;
}

export function UpdateFogCanvas(ctx: CanvasRenderingContext2D, player: Item, floor: Floor, center: Coord) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const rayPoints = shootRaysInCircle(player.position, floor);
    const ps = toScreenSpot(player.position, center);
    const gradient = ctx.createRadialGradient(ps.x, ps.y,70, ps.x, ps.y, viewDist * tileSize);
    gradient.addColorStop(0, "lightyellow");
    gradient.addColorStop(.07, "rgba(255,255,0,1)");
    gradient.addColorStop(.2, "rgba(255,255,0,.8)");
    gradient.addColorStop(1, "rgba(255,128,0,0)");

    ctx.fillStyle = gradient; // "lightyellow";
    ctx.strokeStyle = "1px lightyellow";
    ctx.beginPath();
    const playerCoord = toScreenSpot(player.position, center);
    ctx.moveTo(playerCoord.x, playerCoord.y);
    rayPoints.forEach(point => {
        const p = toScreenSpot(point, center);
        ctx.lineTo(p.x, p.y);
    });
    const p = toScreenSpot(rayPoints[0], center);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.fill();
}