import React from 'react';
import { HostGame } from './play/hostGame';
import { PlayerGame } from './play/playerGame';

export function Game(props: { isHost: boolean }) {
  if (props.isHost) {
    return <HostGame {...props} />;
  }

  return <PlayerGame />;
}