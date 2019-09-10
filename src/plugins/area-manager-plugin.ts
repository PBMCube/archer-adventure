import 'phaser';
import { BaseScene } from '../scenes/base-scene';

export class AreaManagerPlugin extends Phaser.Plugins.ScenePlugin {
  public scale: number;

  public map!: Phaser.Tilemaps.Tilemap;
  public tileset!: Phaser.Tilemaps.Tileset;

  public tileLayers: Phaser.Tilemaps.StaticTilemapLayer[];
  public objects: { [layerName: string]: any[] };
  public markers: { [name: string]: { x: number, y: number } };

  private areaMap: { [areaName: string]: any };

  public adventurer!: Entities.Adventurer;

  constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
    super(scene, pluginManager);

    this.scale = 1;

    this.tileLayers = [];
    this.objects = {};
    this.markers = {};

    this.areaMap = {};
  }

  registerArea(key: string, mapKey: string, tilesetName: string, tilesetKey: string, scale: number = 1) {
    this.areaMap[key] = {
      mapKey,
      tilesetName,
      tilesetKey,
      scale
    };
  }

  load(key: string) {
    const area = this.areaMap[key];

    const map = this.scene.make.tilemap({ key: area.mapKey });
    const tileset = map.addTilesetImage(area.tilesetName, area.tilesetKey);

    this.map = map;
    this.tileset = tileset;
    this.scale = area.scale;

    this.tileLayers = [];
    this.objects = {};

    this.loadMarkers();
    this.createTileLayers(this.map.layers.map(layer => layer.name));
    this.createObjectLayers(this.map.objects.map(layer => layer.name));
  }

  unload() {
    this.objects = {};

    this.tileLayers.forEach(layer => layer.destroy());
    this.tileLayers = [];

    delete this.tileset;

    if (this.map) {
      this.map.destroy();
    }
  }

  placeEntityAtMarker(entity: Systems.HasSprite.Entity, markerName: string) {
    const marker = this.markers[markerName];

    entity.sprite.setPosition(marker.x, marker.y - entity.sprite.displayHeight / this.scale);
  }

  private loadMarkers() {
    this.map.objects.forEach(objectLayer => {
      objectLayer.objects.forEach(object => {
        const properties = this.normalizeProperties(object.properties);
        if (properties.marker) {
          this.markers[object.name] = {
            x: object.x! * this.scale,
            y: object.y! * this.scale
          };
        }
      });
    });
  }

  private createTileLayers(layerNames: string[]) {
    layerNames.forEach(layerName => this.createTileLayer(layerName));
  }

  private createTileLayer(layerName: string): void {
    const layer = this.map.createStaticLayer(layerName, this.tileset, 0, 0);
    layer.setScale(this.scale);

    const layerProperties: any = this.normalizeProperties(layer.layer.properties);

    if (layerProperties.collides) {
      layer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
        tile.setCollision(true, true, true, true, false);
      }, this, 0, 0, layer.width, layer.height, { isNotEmpty: true });

      layer.calculateFacesWithin(0, 0, layer.width, layer.height);
    }

    layer.setDepth(layerProperties.depth)

    this.tileLayers.push(layer);
  }

  private createObjectLayers(layerNames: string[]) {
    layerNames.forEach(layerName => this.createObjects(layerName));
  }

  private createObjects(layerName: string): void {
    const layer = this.map.getObjectLayer(layerName);
    const layerProperties = this.normalizeProperties(layer.properties);
    const tiledObjects = layer.objects;

    this.objects[layerName] = [];

    tiledObjects.forEach((tiledObject: Phaser.Types.Tilemaps.TiledObject) => {
      let entity = null;

      if (tiledObject.type) {
        entity = (this.scene as BaseScene).entityManager.createPrefab(tiledObject.type, tiledObject.properties, this.scale, layerProperties.depth, tiledObject.x, tiledObject.y);
      }

      this.objects[layerName].push(entity);
    });
  }

  private normalizeProperties(properties: any): { [key: string]: any } {
    if (Array.isArray(properties)) {
      return properties.reduce((acc: any, propertyMap: any) => {
        acc[propertyMap.name] = propertyMap.value;
        return acc;
      }, {});
    } else {
      return properties || {};
    }
  }
}