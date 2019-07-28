import { Adventurer } from '..';
import { TransitionType, StateMerge } from '../../../components/phinite-state';
import { movementAttributes } from '../movement-attributes';
import { baseFall } from './base-fall';

export const adventurerFall = StateMerge(baseFall, {
  id: 'adventurer-fall',
  transitions: [
    {
      type: TransitionType.Input,
      event: Phaser.Input.Keyboard.Events.ANY_KEY_DOWN,
      key: 'ArrowLeft',
      to: 'adventurer-fall-left',
    },
    {
      type: TransitionType.Input,
      event: Phaser.Input.Keyboard.Events.ANY_KEY_DOWN,
      key: 'ArrowRight',
      to: 'adventurer-fall-right',
    }
  ],
});