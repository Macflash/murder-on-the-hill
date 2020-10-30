import React from 'react';
import { GridItem } from "./Items";
import { Coord } from '../coordinates/Coord';
import { Creature, PlayerStats } from './Stats';

export interface Player extends Creature {
  // Right now there is nothing special.
  // Later we will probably add things like.. connection and voice and stuff
  playerId: string; // probably want items to have an ID as well.
}


export const player: Player = {
  playerId: "host",
  // item stuff
  position: { x: 0, y: 0, floor: 0 },
  height: 50,
  width: 25,
  color: "red",
  name: "You",
  velocity: { x: 0, y: 0 },
  mass: 140,

  blockObjects: true,
  moveable: true, // Is this really smart??

  //player stuff
  stats: new PlayerStats(4, 4, 4, 3),
  inventory: [],

};

const colors = [ "red", "blue", "yellow", "purple", "white", "green"];
let colorIndex = 0;

export function BasicPlayer(playerId: string): Player {
  return {
    playerId,
    // item stuff
    position: { x: 0, y: 0, floor: 0 },
    height: 50,
    width: 25,
    color: colors[(colorIndex++)%colors.length],
    name: "You",
    velocity: { x: 0, y: 0 },
    mass: 140,

    blockObjects: true,
    moveable: true, // Is this really smart??

    //player stuff
    stats: new PlayerStats(4, 4, 4, 3),
    inventory: [],
  };
}

export const playerZindex = 51;

export function GridPlayer(props: { center: Coord, player: Player }) {
  return <GridItem item={props.player} zIndex={playerZindex} center={props.center} />
}
