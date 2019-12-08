import { SpriteComponent } from "../../components/sprite-component";
import { PhysicsBodyComponent } from "../../components/physics-body-component";
import { AttachmentComponent } from "../../components/attachment-component";
import { PhiniteStateMachineComponent } from "../../components/phinite-state-machine-component";
import { HurtboxComponent } from "../../components/hurtbox-component";
import { HitboxComponent } from "../../components/hitbox-component";
import { HealthComponent } from "../../components/health-component";
import { InteractionCircleComponent } from "../../components/interaction-circle-component";
import { EnemyComponent } from "../../components/enemy-component";
import { ZoneBoundaryComponent } from "../../components/zone-boundary-component";
import { SceneComponent } from "../../components/scene-component";

export const enemyPrefab: Phecs.Prefab = {
  components: [
    {
      component: SpriteComponent,
      data: {
        texture: 'enemy',
        frame: 0,
      }
    },
    {
      component: PhysicsBodyComponent,
    },
    {
      component: AttachmentComponent,
      data: {
        attachmentDebug: false,
      }
    },
    {
      component: PhiniteStateMachineComponent,
      data: {
        stateSet: 'enemy',
        initialStateId: 'enemy-idle',
      }
    },
    {
      component: HurtboxComponent,
      data: {
        hurtboxesKey: 'enemy-hurtboxes',
      }
    },
    {
      component: HitboxComponent,
      data: {
        hitboxesKey: 'enemy-hitboxes',
      }
    },
    {
      component: HealthComponent,
      data: {
        maxHealth: 2,
      }
    },
    {
      component: InteractionCircleComponent,
      data: {
        interactionRadius: 220,
        interactionDebug: false,
      }
    },
    {
      component: EnemyComponent,
    },
    {
      component: ZoneBoundaryComponent,
      data: {
        zoneBoundaryName: 'enemyBounds',
      }
    },
    {
      component: SceneComponent,
    }
  ]
};
