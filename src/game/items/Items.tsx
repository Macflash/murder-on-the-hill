import * as React from 'react';
import { Coord } from "../coordinates/Coord";
import { toScreenSpot } from '../hud/SightLines';
import { PlayerItemInteraction, PickUpItem, DisplayItemInfo, CantDropItem, DropItem } from './Interaction';

export interface Item {
    position: Coord;
    height: number;
    width: number;

    name?: string;
    description?: string;
    color?: string; // TODO this should be an image or graphic or canvas dude!

    /** Whether the item can be moved by being collided with */
    moveable?: boolean; // this could probably be signaled by undefined VELOCITY? idk.. w/e

    /** Whether player/other items can go through the item */
    blockObjects?: boolean;

    mass: number;
    velocity: Coord;
    image?: string;
    imageTransform?: string;

    hidden?: boolean;

    playerInteractions?: PlayerItemInteraction[];
}

var drawnImages = new Map<string, HTMLImageElement>();

export function DrawItemToCtx(item: Item, ctx: CanvasRenderingContext2D) {
    const box = ToBoundingBox(item);
    const screenC = toScreenSpot(box); // weird cast but ok duck typing do your thing
    if (item.image) {
        let imageEL = drawnImages.get(item.image);
        if (!imageEL) {
            imageEL = document.createElement("img") as HTMLImageElement;
            imageEL.src = item.image;
            drawnImages.set(item.image, imageEL);
        }
        ctx.drawImage(imageEL, screenC.x, screenC.y);
    }
    else {
        ctx.fillStyle = item.color || "grey"; // grey..ish?
        ctx.fillRect(screenC.x, screenC.y, box.width, box.height);
    }
}

export function ToBoundingBox(item: Item) {
    return {
        x: item.position.x - item.width * .5,
        y: item.position.y - item.height * .5,
        height: item.height,
        width: item.width,
    };
}

/* Check two items for collision! */
export function RectangleCollision(a: Item, b: Item) {
    const rect1 = ToBoundingBox(a);
    const rect2 = ToBoundingBox(b);
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

var items: Item[] = [];

// yo if we stored these BY room it would be pretty cool.
export function AddItem(item: Item) {
    items.push(item);
}

export function GetItems() {
    return items.filter(item => !item.hidden);
}

export const itemZindex = 50;


export function GridItem(props: { item: Item, zIndex?: number, tileOffset?: Coord, center: Coord }) {
    const { item, tileOffset, center, zIndex } = props;
    const hW = item.width * .5;
    const hH = item.height * .5;

    return <div
        title={item.name}
        style={{
            position: "absolute",
            zIndex: zIndex || itemZindex,
            height: item.height,
            width: item.width,
            backgroundColor: item.image ? undefined : item.color || "grey",
            left: item.position.x - center.x + (.5 * window.innerWidth) - hW - (tileOffset?.x || 0),
            top: item.position.y - center.y + (.5 * window.innerHeight) - hH - (tileOffset?.y || 0),
        }}>
        {item.image ? <img src={item.image} style={{ transform: item.imageTransform }} /> : null}
    </div>;
}

export const curesedKnife: Item = {
    position: { x: 0, y: 30 },
    height: 5,
    width: 20,
    color: "red",
    name: "Wicked Knife",
    mass: 5,
    velocity: { x: 0, y: 0 },
    description: "A sickening looking knife. You can't tell if that is blood or rust on the blade. Yet you feel oddly... compelled to pick it up.",
    playerInteractions: [PickUpItem, DisplayItemInfo, CantDropItem],
};

export const watch: Item = {
    position: { x: 150, y: 180 },
    height: 15,
    width: 20,
    color: "green",
    name: "Purse",
    mass: 4,
    velocity: { x: 0, y: 0 },
    description: "A fancy purse. It looks old, who could have left it here?",
    playerInteractions: [PickUpItem, DisplayItemInfo, DropItem],
};

export const box: Item = {
    position: { x: 0, y: 40 },
    height: 20,
    width: 20,
    color: "brown",
    name: "Box",
    mass: 15,
    velocity: { x: 0, y: 0 },
    description: "A closed cardboard box. It feels heavy. What could be inside?",
    playerInteractions: [PickUpItem, DisplayItemInfo, DropItem],
};


export const purse: Item = {
    position: { x: (Math.random() - .5) * 300, y: 150 },
    height: 10,
    width: 10,
    color: "gold",
    name: "Watch",
    mass: .5,
    velocity: { x: 0, y: 0 },
    description: "A small, worn pocketwatch. It looks like it is made of gold, but the time is stuck at midnight. What could happen if you wind it?",
    playerInteractions: [PickUpItem, DisplayItemInfo, DropItem],
};

export const table: Item = {
    position: { x: -70, y: -150 },
    height: 70,
    width: 40,
    color: "tan",
    name: "Table",
    blockObjects: true,
    mass: 70,
    velocity: { x: 0, y: 0 },
};

export function CopyItem(item: Item) {
    return {
        ...item,
        position: { ...item.position },
        velocity: { ...item.velocity },
    }
}
// */