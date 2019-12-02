import { HealthComponent } from './health-component';
import { PhiniteStateMachineComponent } from './phinite-state-machine-component';

export class EnemyComponent implements Phecs.Component {
  public static tag: string = 'enemy';

  constructor(scene: Phaser.Scene, data: Phecs.EntityData, entity: Phecs.Entity) {
    const healthComponent = entity.components[HealthComponent.tag];
    const phiniteStateMachine = entity.components[PhiniteStateMachineComponent.tag].phiniteStateMachine;

    healthComponent.onDamage(() => {
      phiniteStateMachine.doTransition({ to: 'enemy-stun' });
    });

    healthComponent.onDeath(() => {
      phiniteStateMachine.doTransition({ to: 'enemy-dead' });
    });
  }

  destroy() {

  }
}