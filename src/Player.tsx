import React from 'react';
import { GridItem, Item } from "./tiles/Items";
import kid_green from "./images/players/kid_green.png";

export const player: Item = {
  position: { x: 0, y: 0 },
  height: 50,
  width: 25,
  color: "red",
  name: "You",
  velocity: { x: 0, y: 0 },
  mass: 140,
  image: kid_green,
};

export const playerZindex = 51;

export function Player() {
  return <GridItem item={player} zIndex={playerZindex} />
}
