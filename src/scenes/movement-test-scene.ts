import 'phaser';

import { SystemsManager } from '../lib/systems/systems-manager';
import { SignSystem } from '../systems/sign-system';
import { HasSpriteSystem } from '../systems/has-sprite-system';
import { HasPhysicalSpriteSystem } from '../systems/has-physical-sprite-system';
import { HasInteracionCircleSystem } from '../systems/has-interaction-circle-system';
import { HasIndicatorSystem } from '../systems/has-indicator-system';
import { HasBoundsSystem } from '../systems/has-bounds-system';
import { HasControlsSystem } from '../systems/has-controls-system';
import { HasHurtboxesSystem } from '../systems/has-hurtboxes-system';
import { HasPhiniteStateMachineSystem } from '../systems/has-phinite-state-machine-system';

import { AreaManager } from '../lib/area-manager/area-manager';

import { adventurerStates } from '../entities/adventurer/states';
import { StateRegistrar } from '../lib/phinite-state-machine/state-registrar';

export class MovementTestScene extends Phaser.Scene {
  private systemsManager: SystemsManager;
  private stateRegistrar: StateRegistrar;

  constructor(config: any) {
    super(config);

    this.systemsManager = new SystemsManager();
    this.stateRegistrar = new StateRegistrar();
  }

  preload() {
    // adventurer
    this.load.spritesheet('adventurer-core', '/assets/sprites/adventurer/adventurer-core.png', { frameWidth: 50, frameHeight: 37 })
    this.load.spritesheet('adventurer-bow', '/assets/sprites/adventurer/adventurer-bow.png', { frameWidth: 50, frameHeight: 37 })

    this.load.animation('adventurer-animations', '/assets/animations/adventurer.json');
    this.load.json('adventurer-hurtboxes', '/assets/hurtboxes/adventurer.json');
    this.load.json('adventurer-bounds', '/assets/bounds/adventurer.json');

    // sheep
    this.load.spritesheet('sheep-walk', '/assets/sprites/sheep/sheep-walk.png', { frameWidth: 20, frameHeight: 17 });
    this.load.animation('sheep-animations', '/assets/animations/sheep.json');

    // indicators
    this.load.spritesheet('indicator-down', '/assets/sprites/indicators/indicator-down.png', { frameWidth: 16, frameHeight: 16 })
    this.load.animation('indicator-animations', '/assets/animations/indicators.json');

    // tilemap spritesheet
    this.load.spritesheet('fantasy-platformer-core-spritesheet', '/assets/tilesets/fantasy-platformer-core.png', { frameWidth: 16, frameHeight: 16 });

    // tilemap
    this.load.image('fantasy-platformer-core', '/assets/tilesets/fantasy-platformer-core.png');
    this.load.tilemapTiledJSON('starting-area', '/assets/tilemaps/starting-area.json')
  }

  create() {
    adventurerStates.forEach((state: PhiniteStateMachine.States.State<Entities.Adventurer>) => {
      this.stateRegistrar.addState(state.id, state);
    });
    this.stateRegistrar.addSet('adventurer', adventurerStates.map((state: PhiniteStateMachine.States.State<Entities.Adventurer>) => state.id));

    this.systemsManager.registerSystem(new SignSystem(), [SignSystem.SystemTags.interactor, SignSystem.SystemTags.sign]);
    this.systemsManager.registerSystem(new HasSpriteSystem(this), HasSpriteSystem.SystemTags.hasSprite);
    this.systemsManager.registerSystem(new HasPhysicalSpriteSystem(this), HasPhysicalSpriteSystem.SystemTags.hasPhysicalSprite);
    this.systemsManager.registerSystem(new HasInteracionCircleSystem(this), HasInteracionCircleSystem.SystemTags.hasInteractionCircle);
    this.systemsManager.registerSystem(new HasIndicatorSystem(this), HasIndicatorSystem.SystemTags.hasIndicator);
    this.systemsManager.registerSystem(new HasBoundsSystem(this), HasBoundsSystem.SystemTags.hasBounds);
    this.systemsManager.registerSystem(new HasControlsSystem(this), HasControlsSystem.SystemTags.hasControls);
    this.systemsManager.registerSystem(new HasHurtboxesSystem(this), HasHurtboxesSystem.SystemTags.hasHurtboxes);
    this.systemsManager.registerSystem(new HasPhiniteStateMachineSystem(this, this.stateRegistrar), HasPhiniteStateMachineSystem.SystemTags.hasPhiniteStateMachineSystem);

    const areaManager = new AreaManager(this, 'starting-area', 'fantasy-platformer-core', 'fantasy-platformer-core', 2);
    const map = areaManager.map;
    areaManager.createTileLayers([
      'ground',
      'background-base',
      'background-details',
      'foreground'
    ]);

    areaManager.createObjects('signs', this.systemsManager);
    areaManager.createObjects('npcs', this.systemsManager);
    const adventurer: Entities.Adventurer  = areaManager.createObjects('adventurer', this.systemsManager)[0];

    this.systemsManager.registerEntity(adventurer, HasPhiniteStateMachineSystem.SystemTags.hasPhiniteStateMachineSystem, {
      setId: 'adventurer',
      initialStateId: 'adventurer-stand',
    });

    this.cameras.main.setBounds(0, 0, map.width * areaManager.tileset.tileWidth * 2, map.height * areaManager.tileset.tileHeight * 2);
    this.cameras.main.startFollow(adventurer.sprite, true);
  }

  update() {
    this.systemsManager.update();
  }
}
