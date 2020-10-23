import React from 'react';
import { GridItem, Item } from "./tiles/Items";

export const player: Item = {
  position: { x: 0, y: 0 },
  height: 30,
  width: 15,
  color: "red",
  name: "You",
  velocity: { x: 0, y: 0 },
  mass: 140,
};

export const playerZindex = 51;

export function Player() {
  return <GridItem item={player} zIndex={playerZindex} />
}
