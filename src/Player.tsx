import React from 'react';
import { Item } from "./tiles/Items";
import { centerY, centerX } from './App';

export const player: Item = {
  position: { x: 0, y: 0 },
  height: 30,
  width: 15,
};

export function Player() {
  const hW = player.width * .5;
  const hH = player.height * .5;

  return <div style={{
    position: "absolute",
    zIndex: 50,
    height: player.height,
    width: player.width,
    backgroundColor: "red",

    top: player.position.y - centerY + (.5 * window.innerHeight) - hH,
    left: player.position.x - centerX + (.5 * window.innerWidth) - hW,
  }}>
  </div>;
}
