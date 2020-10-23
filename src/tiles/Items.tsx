import * as React from 'react';
import { centerY, centerX } from '../App';
import { Coord, Copy } from "./Coord";

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

// TODO: actually do this stuff and like track some basic stats
export interface Player extends Item {
    /**
     * Items you are carrying.
     * IDK do we need some kind of ACTIVE vs CARRIED distinction for some items,
     * like you can't have 4 weapons at the same time
     */
    inventory: Item[];
    health: number;
    fear: number;
    strength: number; // force when moving, affects carry strength
    speed: number;
    intelligence: number;
    spirit: number; // like religion, spiritual strength. e/g/ won't be scared from weird shit dude.
}

interface PlayerItemInteraction {
    name: string,
    canDoOnGround: boolean,
    canDoInInventory: boolean,
    action: PlayerItemInteraction_Action,
}

const PickUpItem: PlayerItemInteraction = {
    name: "Pick up",
    canDoOnGround: true,
    canDoInInventory: false,
    action: (player, item) => {
        if (item.hidden) {
            throw new Error("Cant pick up a hidden item!!!");
        }
        player.inventory.push(item);
        item.hidden = true;
    }
}

const DropItem: PlayerItemInteraction = {
    name: "Drop",
    canDoOnGround: false,
    canDoInInventory: true,
    action: (player, item) => {
        if (!item.hidden) {
            throw new Error("Cant drop up a visible item!!!");
        }

        item.position = Copy(player.position);
        player.inventory.splice(player.inventory.indexOf(item), 1);
        item.hidden = false;
    }
}

const DisplayItemInfo: PlayerItemInteraction = {
    name: "Info",
    canDoOnGround: true,
    canDoInInventory: true,
    action: (player, item) => {
        alert(item.description);
    }
}

const CantDropItem: PlayerItemInteraction = {
    name: "Try to drop",
    canDoOnGround: false,
    canDoInInventory: true,
    action: (player, item) => {
        alert("You can't put it down, it's as if it was part of you now.");
    }
}


type PlayerItemInteraction_Action = (player: Player, item: Item) => void;

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


export function GridItem(props: { item: Item, zIndex?: number, tileOffset?: Coord }) {
    const { item, tileOffset } = props;
    const hW = item.width * .5;
    const hH = item.height * .5;

    return <div
        title={item.name}
        style={{
            position: "absolute",
            zIndex: props.zIndex || itemZindex,
            height: item.height,
            width: item.width,
            backgroundColor: item.image ? undefined : item.color || "grey",
            top: item.position.y - centerY + (.5 * window.innerHeight) - hH - (tileOffset?.y ||0),
            left: item.position.x - centerX + (.5 * window.innerWidth) - hW - (tileOffset?.x ||0),
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
    position: {x: 0, y: 40 },
    height: 20,
    width: 20,
    color: "brown",
    name: "Box",
    mass: 15,
    velocity: { x: 0, y: 0 },
    description: "A closed cardboard box. It feels heavy. What could be inside?",
    playerInteractions: [PickUpItem,DisplayItemInfo, DropItem],
};


export const purse: Item = {
    position: {x: (Math.random() - .5) * 300, y: 150 },
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

export function CopyItem(item: Item){
    return {
        ...item,
        position: { ...item.position},
        velocity: { ...item.velocity},
    }
}
// */