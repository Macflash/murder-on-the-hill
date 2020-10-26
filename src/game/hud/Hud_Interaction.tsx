import * as React from 'react';
import { Coord } from '../coordinates/Coord';
import { Item } from "../items/Items";
import { toScreenSpot } from './../coordinates/Coord';
import { MenuStyle } from './MenuStyle';
import { Player } from '../items/Player';

var interactables: Item[] = [];

export function SetInteractables(items: Item[]) {
    interactables = items;
}

export function Add(a: Coord, b: Coord) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

export function toScreenPositionStyle(c: Coord, center: Coord): React.CSSProperties {
    const spot = toScreenSpot(c, center);
    return {
        top: spot.y,
        left: spot.x,
        position: "absolute",
    }
}

export function InteractionButtons({ item, player, inInventory = false, onGround = false }:
    { item: Item, player: Player, inInventory?: boolean, onGround?: boolean }) {
    return <>
        <div>{item.name}</div>
        {item.playerInteractions
            ?.filter(interaction =>
                (interaction.canDoInInventory || !inInventory)
                && (interaction.canDoOnGround || !onGround))
            ?.map(interaction =>
                <button
                    key={interaction.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => interaction.action(player, item)}>
                    {interaction.name}
                </button>)}
    </>;
}

// want it like.. by the player?
export function Interactions(props: { player: Player, center: Coord }) {
    const { player, center } = props;
    if (interactables.length <= 0) { return null; }

    return <>
        {interactables.filter(i => i.name || i.playerInteractions?.length).map(item =>
            <div
                key={item.name}
                style={{
                    ...MenuStyle,
                    zIndex: 100,
                    ...toScreenPositionStyle(Add(
                        item.position,
                        { x: .5 * item.width + 5, y: .5 * item.height + 5 }
                    ), center),
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                }}>
                <InteractionButtons item={item} player={player} onGround={true} />
            </div>
        )}
    </>
}