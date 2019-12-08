import { movementAttributes } from '../movement-attributes';
import { PhysicsBodyComponent } from '../../../components/physics-body-component';
import { AdventurerComponent } from '../../../components/adventurer-component';

function applyAirControls(entity: Phecs.Entity, targetVelocity: number) {
  const body = entity.getComponent(PhysicsBodyComponent).body;
  const controls = entity.getComponent(AdventurerComponent).controls;

  if (controls.left.isDown && body.velocity.x > targetVelocity) {
    body.acceleration.x = -1 * movementAttributes.aerialHorizontalAcceleration;
  } else if (controls.right.isDown && body.velocity.x < targetVelocity) {
    body.acceleration.x = movementAttributes.aerialHorizontalAcceleration;
  }
}

function applyAirFriction(entity: Phecs.Entity) {
  const body = entity.getComponent(PhysicsBodyComponent).body;

  if (body.velocity.x > 0) {
    body.acceleration.x = -1 * movementAttributes.aerialHorizontalFrictionAcceleration;
  } else if (body.velocity.x < 0) {
    body.acceleration.x = movementAttributes.aerialHorizontalFrictionAcceleration;
  } else {
    body.acceleration.x = 0;
  }
}

export const baseAerial: Partial<PhiniteStateMachine.States.State<Phecs.Entity>> = {
  onUpdate(entity: Phecs.Entity, data: PhiniteStateMachine.States.StateData) {
    const body = entity.getComponent(PhysicsBodyComponent).body;
    const controls = entity.getComponent(AdventurerComponent).controls;
    const controlsAreDown = controls.left.isDown || controls.right.isDown;

    if (controlsAreDown) {
      applyAirControls(entity, data.targetAerialHorizontalVelocity);
    } else {
      applyAirFriction(entity);
    }

    if (Phaser.Math.Within(data.targetAerialHorizontalVelocity, body.velocity.x, 5)) {
      body.acceleration.x = 0;
      body.velocity.x = data.targetAerialHorizontalVelocity;
    }
  },
}
