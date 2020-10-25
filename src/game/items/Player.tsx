import React from 'react';
import { GridItem } from "./Items";
import kid_green from "./../../images/players/kid_green.png";
import { Coord } from '../coordinates/Coord';
import { Creature, PlayerStats } from './Stats';

export interface Player extends Creature {
  // Right now there is nothing special.
  // Later we will probably add things like.. connection and voice and stuff
}

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

  blockObjects: true,
  moveable: true, // Is this really smart??

  //player stuff
  stats: new PlayerStats(4,4,4,3),
  inventory: [],

};

export const playerZindex = 51;

export function GridPlayer(props: { center: Coord }) {
  return <GridItem item={player} zIndex={playerZindex} center={props.center} />
}
