import * as React from 'react';
import { InteractionButtons } from './Hud_Interaction';
import { MenuStyle } from "./MenuStyle";
import { Player } from "../items/Items";

// want it like.. by the player?
export function Inventory(props: { player: Player }) {
    const { player } = props;
    const inventory = player.inventory;

    if (inventory.length <= 0) { return null; }
    return <div style={{
        ...MenuStyle,
        zIndex: 75,
        bottom: 20,
        left: 20,

    }}>
        <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
        }}>
            {inventory.map(item =>
                <div style={{
                    padding: 10,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}>
                    {item.image
                        ? <img
                            src={item.image}
                            style={{
                                cursor: "pointer",
                                maxWidth: 50,
                                maxHeight: 50
                            }}
                        />
                        : <div style={{
                            cursor: "pointer",
                            backgroundColor: item.color,
                            width: item.width,
                            height: item.height
                        }}></div>}

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <InteractionButtons item={item} player={player} inInventory={true} />
                    </div>
                </div>
            )}
        </div>
    </div>
}