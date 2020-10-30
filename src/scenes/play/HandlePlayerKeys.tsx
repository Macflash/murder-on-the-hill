import { Coord } from '../../game/coordinates/Coord';
import { Player } from '../../game/items/Player';
import { GetKeyStates } from './KeyboardControls';

export const moveSpeed = 2;
export const playerAccel = .3;
export const mapSpeed = 7;

export function HandlePlayerKeys(player: Player, center: Coord) {
  const keys = GetKeyStates();
  if (keys.showMap) {
    if (keys.leftPressed) {
      center.x -= mapSpeed;
    }
    if (keys.rightPressed) {
      center.x += mapSpeed;
    }
    if (keys.upPressed) {
      center.y -= mapSpeed;
    }
    if (keys.downPressed) {
      center.y += mapSpeed;
    }
  }
  else {
    player.velocity = player.velocity || { x: 0, y: 0 };
    if (keys.leftPressed && player.velocity.x > -moveSpeed) {
      //player.position.x -= moveSpeed;
      player.velocity.x -= playerAccel;
      player.imageTransform = undefined;
    }
    if (keys.rightPressed && player.velocity.x < moveSpeed) {
      //player.position.x += moveSpeed;
      player.velocity.x += playerAccel;
      player.imageTransform = "scale(-1,1)";
    }
    if (keys.upPressed && player.velocity.y > -moveSpeed) {
      //player.position.y -= moveSpeed;
      player.velocity.y -= playerAccel;
    }
    if (keys.downPressed && player.velocity.y < moveSpeed) {
      //player.position.y += moveSpeed;
      player.velocity.y += playerAccel;
    }
  }

  return { ...keys };
}
