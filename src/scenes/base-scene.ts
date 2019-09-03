import 'phaser';

import { SystemsManagerPlugin } from '../plugins/systems-manager-plugin';
import { StateRegistrarPlugin } from '../plugins/state-registrar-plugin';
import { AreaManager } from '../lib/area-manager/area-manager';

export abstract class BaseScene extends Phaser.Scene {
  systemsManager!: SystemsManagerPlugin;
  stateRegistrar!: StateRegistrarPlugin;
  areaManager!: AreaManager;

  loadNewArea(tilemapKey: string, tilesetName: string, tilesetKey: string, scale: number) {
    this.systemsManager.destroyEntities();

    this.areaManager.unload();
    this.areaManager.load(tilemapKey, tilesetName, tilesetKey, scale);

    const adventurer = this.areaManager.objects['adventurer'][0];

    const map = this.areaManager.map;
    const tileset = this.areaManager.tileset;
    this.cameras.main.setBackgroundColor(0xCCCCCC);
    this.cameras.main.setBounds(0, 0, map.width * tileset.tileWidth * 2, map.height * tileset.tileHeight * 2);
    this.cameras.main.startFollow(adventurer.sprite, true);
  }
}
