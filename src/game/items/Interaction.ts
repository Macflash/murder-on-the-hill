import { Copy } from "../coordinates/Coord";
import { Item } from "./Items";
import { Player } from "./Player";

export interface PlayerItemInteraction {
    name: string,
    canDoOnGround: boolean,
    canDoInInventory: boolean,
    action: PlayerItemInteraction_Action,
}

export const PickUpItem: PlayerItemInteraction = {
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

export const DropItem: PlayerItemInteraction = {
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

export const DisplayItemInfo: PlayerItemInteraction = {
    name: "Info",
    canDoOnGround: true,
    canDoInInventory: true,
    action: (player, item) => {
        alert(item.description);
    }
}

export const CantDropItem: PlayerItemInteraction = {
    name: "Try to drop",
    canDoOnGround: false,
    canDoInInventory: true,
    action: (player, item) => {
        alert("You can't put it down, it's as if it was part of you now.");
    }
}

export type PlayerItemInteraction_Action = (player: Player, item: Item) => void;
