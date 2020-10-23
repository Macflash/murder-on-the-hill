import React from 'react';
import { GridItem, Item, Player } from "./tiles/Items";
import kid_green from "./images/players/kid_green.png";

export const player: Player = {
  // item stuff
  position: { x: 0, y: 0 },
  height: 50,
  width: 25,
  color: "red",
  name: "You",
  velocity: { x: 0, y: 0 },
  mass: 140,
  image: kid_green,
  
  //player stuff
  fear: 0,
  health: 100,
  intelligence: 5,
  speed: 2,
  inventory: [],
  spirit: 2,
  strength: 5,
  
};

export const playerZindex = 51;

export function GridPlayer() {
  return <GridItem item={player} zIndex={playerZindex} />
}
