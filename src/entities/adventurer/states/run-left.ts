import { Adventurer } from '../index';
import { TransitionType, StateMerge } from '../../../components/phinite-state';
import { movementAttributes } from '../movement-attributes';

import { baseRun, startRunning } from './base-run';

export const adventurerRunLeft = StateMerge(baseRun, {
  id: 'adventurer-run-left',
  onEnter(adventurer: Adventurer) {
    adventurer.sprite.flipX = true;
    adventurer.sprite.anims.play('adventurer-run');

    startRunning(adventurer, "left");
  },
  transitions: [
    {
      type: TransitionType.Input,
      event: Phaser.Input.Keyboard.Events.ANY_KEY_UP,
      key: 'ArrowLeft',
      to: 'adventurer-stand',
    },
    {
      type: TransitionType.Input,
      event: Phaser.Input.Keyboard.Events.ANY_KEY_DOWN,
      key: 'ArrowRight',
      to: 'adventurer-run-right',
    },
  ]
});
