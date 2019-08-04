export class Hitboxes<T extends (PhysicallyRenderable.Entity | Renderable.Entity)> {
  private scene: Phaser.Scene;
  private entity: T;
  private animationsKey: string;
  private hitboxFrames!: [];

  private rectanglePool: Phaser.Geom.Rectangle[];
  private activeRectangles: Phaser.Geom.Rectangle[];

  private debugRectangles: Phaser.GameObjects.Rectangle[];
  private debug: boolean;
  private debugPointerPosition: any;
  private debugColor: number;

  constructor(scene: Phaser.Scene, entity: T, animationsKey: string, debug: boolean = false) {
    this.scene = scene;
    this.entity = entity;
    this.animationsKey = animationsKey;

    this.rectanglePool = [];
    this.activeRectangles = [];

    this.debug = debug;
    this.debugColor = 0x00FF00;
    this.debugRectangles = [];
  }

  create() {
    this.hitboxFrames = this.scene.cache.json.get(this.animationsKey).frames;

    this.debugRectangles = []
    this.debugPointerPosition = { x: 0, y: 0 };

    if (this.debug) {
      this.scene.input.on('pointermove', (e: any) => {
        this.debugPointerPosition = e.position;
      });
    }
  }

  update() {
    this.disableHitboxes();

    const key = this.entity.sprite.frame.texture.key;
    const frame = this.entity.sprite.frame.name;

    const hitboxDefinition: any = this.hitboxFrames.find((a: Phaser.Types.Animations.JSONAnimationFrame) => a.key === key && a.frame === frame);
    if (hitboxDefinition && hitboxDefinition.hitboxes) {
      hitboxDefinition.hitboxes.forEach((hitbox: any) => {
        if (hitbox.type === 'rectangle') {
          this.setRectangleHitbox(hitbox);
        } else {
          throw 'unsupported hitbox type';
        }
      })
    }

    if (this.debug) {
      this.renderDebugHitboxes();
    }
  }

  renderDebugHitboxes() {
    const point = new Phaser.Geom.Point(this.debugPointerPosition.x, this.debugPointerPosition.y);

    this.activeRectangles.forEach((activeRectangle, i) => {
      if (Phaser.Geom.Rectangle.ContainsPoint(activeRectangle, point)) {
        this.debugColor = 0xFF0000;
      } else {
        this.debugColor = 0x00FF00;
      }

      const debugRectangle = this.debugRectangles[i];

      debugRectangle.visible = true;
      debugRectangle.fillColor = this.debugColor;

      debugRectangle.setOrigin(0, 0);
      debugRectangle.x = activeRectangle.x;
      debugRectangle.y = activeRectangle.y;
      debugRectangle.width = activeRectangle.width;
      debugRectangle.height = activeRectangle.height;
    })
  }

  disableHitboxes() {
    this.rectanglePool = [...this.rectanglePool, ...this.activeRectangles];
    this.activeRectangles = [];

    this.debugRectangles.forEach(r => r.visible = false);
  }

  getAvailableRectangle() {
    let rectangle = this.rectanglePool.pop();
    if (rectangle == null) {
      rectangle = new Phaser.Geom.Rectangle(0, 0, 0, 0);
      if (this.debug) {
        this.debugRectangles.push(this.scene.add.rectangle(0, 0, 0, 0, this.debugColor, 0.5));
      }
    }

    this.activeRectangles.push(rectangle);
    return rectangle;
  }

  setRectangleHitbox(hitbox: any) {
    const rectangle = this.getAvailableRectangle();

    const scaleX = this.entity.sprite.scaleX;
    const scaleY = this.entity.sprite.scaleY;

    const width = scaleX * hitbox.width;
    const height = scaleY * hitbox.height;
    const x = (this.entity.sprite.x + (hitbox.x * scaleX)) - (width * this.entity.sprite.originX);
    const y = (this.entity.sprite.y + (hitbox.y * scaleY)) - (height * this.entity.sprite.originY);

    rectangle.x = x;
    rectangle.y = y;
    rectangle.width = width;
    rectangle.height = height;
  }
}
