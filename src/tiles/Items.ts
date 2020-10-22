import { Coord } from "./Coord";

export interface Item {
    position: Coord;
    height: number;
    width: number;
}

var items: Item[] = [];

// yo if we stored these BY room it would be pretty cool.
export function AddItem(item: Item) {
    items.push(item);
}

export function GetItems(){

}