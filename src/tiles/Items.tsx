import * as React from 'react';
import { centerY, centerX } from '../App';
import { Coord } from "./Coord";

export interface Item {
    position: Coord;
    height: number;
    width: number;

    name?: string;
    color?: string; // TODO this should be an image or graphic or canvas dude!
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
    position: { x: Math.random() * 600 - 300, y: Math.random() * 400 - 200},
    height: 15,
    width: 20,
    color: "green",
    name: "purse",
});

AddItem({
    position: { x: Math.random() * 200 - 100, y: Math.random() * 400 - 200},
    height: 20,
    width: 20,
    color: "brown",
    name: "Box",
});


AddItem({
    position: { x: Math.random() * 200 - 100, y: Math.random() * 800 - 400},
    height: 10,
    width: 10,
    color: "gold",
    name: "pocketwatch",
});
