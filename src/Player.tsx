import React from 'react';
import { GridItem, Item } from "./tiles/Items";
import { centerY, centerX } from './App';

export const player: Item = {
  position: { x: 0, y: 0 },
  height: 30,
  width: 15,
  color: "red",
  name: "You",
};

export const playerZindex = 51;

export function Player() {
    return <GridItem item={player} zIndex={playerZindex} />
}
