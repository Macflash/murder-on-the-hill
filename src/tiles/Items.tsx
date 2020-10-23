import * as React from 'react';
import { centerY, centerX } from '../App';
import { Coord } from "./Coord";

export interface Item {
    position: Coord;
    height: number;
    width: number;

    name?: string;
    color?: string; // TODO this should be an image or graphic or canvas dude!

    mass: number;
    velocity: Coord;
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
    return items;
}

export const itemZindex = 50;

export function GridItem(props: { item: Item, zIndex?: number }) {
    const { item } = props;
    const hW = item.width * .5;
    const hH = item.height * .5;

    return <div
        title={item.name}
        style={{
            position: "absolute",
            zIndex: props.zIndex || itemZindex,
            height: item.height,
            width: item.width,
            backgroundColor: item.color || "grey",
            top: item.position.y - centerY + (.5 * window.innerHeight) - hH,
            left: item.position.x - centerX + (.5 * window.innerWidth) - hW,
        }}>
    </div>;
}

AddItem({
    position: { x: Math.random() * 600 - 300, y: Math.random() * 400 - 200 },
    height: 15,
    width: 20,
    color: "green",
    name: "purse",
    mass: 4,
    velocity: { x: 0, y: 0 },
});

AddItem({
    position: { x: Math.random() * 200 - 100, y: Math.random() * 400 - 200 },
    height: 20,
    width: 20,
    color: "brown",
    name: "Box",
    mass: 15,
    velocity: { x: 0, y: 0 },
});


AddItem({
    position: { x: Math.random() * 200 - 100, y: Math.random() * 800 - 400 },
    height: 10,
    width: 10,
    color: "gold",
    name: "pocketwatch",
    mass: .5,
    velocity: { x: 0, y: 0 },
});

AddItem({
    position: { x: Math.random() * 200 - 100, y: Math.random() * 800 - 400 },
    height: 70,
    width: 40,
    color: "tan",
    name: "Table",
    mass: 70,
    velocity: { x: 0, y: 0 },
});