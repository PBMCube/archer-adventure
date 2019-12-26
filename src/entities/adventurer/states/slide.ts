import { movementAttributes } from '../movement-attributes';
import { baseGround } from './base-ground';
import { StateMerge } from '../../../lib/phinite-state-machine/state-merge';
import { TransitionType } from '../../../lib/phinite-state-machine/transition-type';
import { SpriteComponent } from '../../../components/sprite-component';
import { PhysicsBodyComponent } from '../../../components/physics-body-component';
import { SceneComponent } from '../../../components/scene-component';
import { BaseScene } from '../../../scenes/base-scene';

export const adventurerSlide: PhiniteStateMachine.States.State<Phecs.Entity> = StateMerge(baseGround, {
  id: 'adventurer-slide',
  onEnter(adventurer: Phecs.Entity) {
    adventurer.getComponent(SpriteComponent).sprite.anims.play('adventurer-slide')

    if (adventurer.getComponent(PhysicsBodyComponent).body.velocity.x > 0) {
      adventurer.getComponent(PhysicsBodyComponent).body.acceleration.x = -1 * movementAttributes.slideDeceleration;
    } else {
      adventurer.getComponent(PhysicsBodyComponent).body.acceleration.x = movementAttributes.slideDeceleration;
    }
  },
  onUpdate(entity: Phecs.Entity) {
    if(Phaser.Math.Within(entity.getComponent(PhysicsBodyComponent).body.velocity.x, 0, 5)) {
      entity.getComponent(PhysicsBodyComponent).body.acceleration.x = 0;
    }
  },
  transitions: [
    {
      type: TransitionType.Conditional,
      condition: (entity: Phecs.Entity) => {
        return !entity.getComponent(SpriteComponent).sprite.anims.isPlaying;
      },
      to: (entity: Phecs.Entity) => {
        const controls = (entity.getComponent(SceneComponent).scene as BaseScene).controls;

        if (controls.left.isPressed) {
          return 'adventurer-run-left';
        } else if (controls.right.isPressed) {
          return 'adventurer-run-right';
        } else if (controls.down.isPressed) {
          return 'adventurer-crouch';
        } else {
          return 'adventurer-stand';
        }
      }
    },
    {
      type: TransitionType.PressControl,
      control: 'up',
      to: 'adventurer-jump-prep',
    }
  ],
});
