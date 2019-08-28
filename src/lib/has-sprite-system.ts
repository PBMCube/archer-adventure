import 'phaser';

import { BaseSystem } from './base-system';

export class HasSpriteSystem<T extends Systems.HasSprite> extends BaseSystem<T> implements Tags.TagSystem {
  static SystemTags = {
    renderable: 'renderable',
  };

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    super(HasSpriteSystem.SystemTags.renderable, '');

    this.scene = scene;
  }

  registerEntity(entity: T, data: { [key: string]: any }): void {
    const { x, y, texture, frame } = data;
    const sprite = this.scene.add.sprite(x, y, texture, frame);

    if (data.scale) {
      sprite.setScale(data.scale);
    }

    entity.sprite = sprite;
  }
}