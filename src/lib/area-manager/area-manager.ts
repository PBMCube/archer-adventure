import 'phaser';
import { HasSpriteSystem } from '../../systems/has-sprite-system';
import { HasInteracionCircleSystem } from '../../systems/has-interaction-circle-system';
import { HasIndicatorSystem } from '../../systems/has-indicator-system';
import { SignSystem } from '../../systems/sign-system';
import { HasPhysicalSpriteSystem } from '../../systems/has-physical-sprite-system';
import { HasHurtboxesSystem } from '../../systems/has-hurtboxes-system';
import { HasBoundsSystem } from '../../systems/has-bounds-system';
import { HasControlsSystem } from '../../systems/has-controls-system';
import { HasPhiniteStateMachineSystem } from '../../systems/has-phinite-state-machine-system';
import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';
import { HasAreaBoundarySystem } from '../../systems/has-area-boundary-system';

export class AreaManager {
  private scene: Phaser.Scene;
  private scale: number;

  public map: Phaser.Tilemaps.Tilemap;
  public tileset: Phaser.Tilemaps.Tileset;

  public layers: Phaser.Tilemaps.StaticTilemapLayer[];

  constructor(scene: Phaser.Scene, mapKey: string, tilesetName: string, tilesetKey: string, scale: number = 1) {
    this.scene = scene;
    this.scale = scale;

    const map = scene.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage(tilesetName, tilesetKey);

    this.map = map;
    this.tileset = tileset;
    this.layers = [];
  }

  createTileLayers(layerNames: string[]) {
    layerNames.forEach(layerName => {

      const layer = this.map.createStaticLayer(layerName, this.tileset, 0, 0);
      layer.setScale(this.scale);

      const properties = layer.layer.properties as any;

      const collisionProperty = properties.collisionProperty;
      if (collisionProperty) {
        layer.setCollisionByProperty({ [collisionProperty]: true })
      }

      layer.setDepth(properties.depth);

      this.layers.push(layer);
    });
  }

  createObjects(layerName: string, systemsManager: SystemsManager.SystemsManager): any[] {
    const createdEntities: any[] = [];
    const layer = this.map.getObjectLayer(layerName);
    const layerProperties = layer.properties as any;
    const tiledObjects = layer.objects;

    tiledObjects.forEach((tiledObject: Phaser.Types.Tilemaps.TiledObject) => {
      const entity = {} as any;

      tiledObject.properties.tags.split(',').forEach((tag: string) => {
        if (tag === HasSpriteSystem.SystemTags.hasSprite) {
          this.registerHasSpriteEntity(entity, tiledObject, systemsManager);
        } else if (tag === HasPhysicalSpriteSystem.SystemTags.hasPhysicalSprite) {
          this.registerHasPhysicalSpriteEntity(entity, tiledObject, systemsManager);
        } else if (tag === HasInteracionCircleSystem.SystemTags.hasInteractionCircle) {
          this.registerHasInteractionCircleEntity(entity, tiledObject, systemsManager);
        } else if (tag === HasIndicatorSystem.SystemTags.hasIndicator) {
          this.registerHasIndicatorEntity(entity, tiledObject, systemsManager);
        } else if (tag === SignSystem.SystemTags.sign) {
          this.registerSignSystemSignEntity(entity, tiledObject, systemsManager);
        } else if (tag === SignSystem.SystemTags.interactor) {
          this.registerSignSystemInteractorEntity(entity, tiledObject, systemsManager);
        } else if (tag === HasHurtboxesSystem.SystemTags.hasHurtboxes) {
          this.registerHasHurtboxesEntity(entity, tiledObject, systemsManager);
        } else if (tag === HasBoundsSystem.SystemTags.hasBounds) {
          this.registerHasBoundsEntity(entity, tiledObject, systemsManager);
        } else if (tag === HasControlsSystem.SystemTags.hasControls) {
          this.registerHasControlsEntity(entity, tiledObject, systemsManager);
        } else if (tag === HasPhiniteStateMachineSystem.SystemTags.hasPhiniteStateMachine) {
          this.registerHasPhiniteStateMachineEntity(entity, tiledObject, systemsManager);
        } else if (tag === HasAreaBoundarySystem.SystemTags.hasAreaBoundary) {
          this.registerHasAreaBoundaryEntity(entity, tiledObject, systemsManager);
        }
      });

      if (tiledObject.properties.layerCollisions) {
        tiledObject.properties.layerCollisions.split(',').forEach((layerName: string) => {
          this.scene.physics.add.collider(entity.sprite, this.layers.find(layer => layer.layer.name === layerName)!);
        });
      }

      if (layerProperties.depth && entity.sprite) {
        entity.sprite.setDepth(layerProperties.depth);
      }

      createdEntities.push(entity);
    });

    return createdEntities;
  }

  private registerHasSpriteEntity(entity: Systems.HasSprite.Entity, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    const { x, y } = this.getObjectPosition(tiledObject);

    systemsManager.registerEntity(entity, HasSpriteSystem.SystemTags.hasSprite, {
      x,
      y,
      texture: tiledObject.properties.texture,
      frame: tiledObject.properties.frame,
      scale: this.scale,
    });
  }

  private registerHasPhysicalSpriteEntity(entity: Systems.HasPhysicalSprite.Entity, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    const { x, y } = this.getObjectPosition(tiledObject);

    systemsManager.registerEntity(entity, HasPhysicalSpriteSystem.SystemTags.hasPhysicalSprite, {
      x,
      y,
      texture: tiledObject.properties.texture,
      frame: tiledObject.properties.frame,
      maxVelocityX: tiledObject.properties.maxVelocityX,
      scale: this.scale,
    });
  }

  private registerHasInteractionCircleEntity(entity: object, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    const { x, y } = this.getObjectPosition(tiledObject);

    systemsManager.registerEntity(entity, HasInteracionCircleSystem.SystemTags.hasInteractionCircle, {
      x,
      y,
      interactionRadius: tiledObject.properties.interactionRadius,
      interactionDebug: tiledObject.properties.interactionDebug || false
    });
  }

  private registerHasIndicatorEntity(entity: Systems.HasSprite.Entity, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    const { x, y } = this.getObjectPosition(tiledObject);

    systemsManager.registerEntity(entity, HasIndicatorSystem.SystemTags.hasIndicator, {
      x,
      y,
      scale: this.scale
    });
  }

  private registerHasHurtboxesEntity(entity: any, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    systemsManager.registerEntity(entity, HasHurtboxesSystem.SystemTags.hasHurtboxes, {
      hurtboxesKey: tiledObject.properties.hurtboxesKey,
      hurtboxesDebug: tiledObject.properties.hurtboxesDebug
    });
  }

  private registerHasBoundsEntity(entity: any, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    systemsManager.registerEntity(entity, HasBoundsSystem.SystemTags.hasBounds, {
      boundsKey: tiledObject.properties.boundsKey
    });
  }

  private registerHasControlsEntity(entity: any, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    systemsManager.registerEntity(entity, HasControlsSystem.SystemTags.hasControls);
  }

  private registerHasPhiniteStateMachineEntity(entity: any, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    systemsManager.registerEntity(entity, HasPhiniteStateMachineSystem.SystemTags.hasPhiniteStateMachine, {
      stateSet: tiledObject.properties.stateSet,
      initialStateId: tiledObject.properties.initialStateId
    });
  }

  private registerHasAreaBoundaryEntity(entity: any, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    systemsManager.registerEntity(entity, HasAreaBoundarySystem.SystemTags.hasAreaBoundary, {
      areaBoundaryLeft: tiledObject.properties.areaBoundaryLeft,
      areaBoundaryRight: tiledObject.properties.areaBoundaryRight
    });
  }

  private registerSignSystemSignEntity(entity: any, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    systemsManager.registerEntity(entity, SignSystem.SystemTags.sign);
  }

  private registerSignSystemInteractorEntity(entity: any, tiledObject: Phaser.Types.Tilemaps.TiledObject, systemsManager: SystemsManager.SystemsManager) {
    systemsManager.registerEntity(entity, SignSystem.SystemTags.interactor);
  }


  private getObjectPosition(tiledObject: Phaser.Types.Tilemaps.TiledObject) {
    return {
      x: tiledObject.x! * this.scale,
      y: tiledObject.y! * this.scale,
    };
  }
}
