// Use global Phaser from CDN
declare const Phaser: any;

import { getChosenChar, CharacterKey } from '../store/GameStore';

export interface PlayerConfig {
  scene: any;
  x: number;
  y: number;
  character?: CharacterKey; // Make optional since we'll use store value
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private character: CharacterKey;
  private cursors!: any;
  private spaceKey!: any;
  private isGrounded = false;
  private atlasKey!: string;
  private animKeys!: {
    run: string;
    idle: string;
    jump: string;
  };

  constructor(config: PlayerConfig) {
    // Get character from store
    const character = getChosenChar();
    const atlasKey = character;

    super(config.scene, config.x, config.y, atlasKey, `${atlasKey}_idle_0`);

    this.character = character;
    this.atlasKey = atlasKey;
    this.animKeys = {
      run: `${atlasKey}_run`,
      idle: `${atlasKey}_idle`,
      jump: `${atlasKey}_jump`,
    };

    console.log(`[Player] Creating player with character: ${character}`);

    // Add to scene
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this);

    // Set physics properties
    const body = this.body as any;
    body.setCollideWorldBounds(true);
    body.setSize(64, 96); // Adjust hitbox size
    body.setOffset(32, 32); // Center the hitbox

    // Scale down the sprite
    this.setScale(0.3);

    // Create animations and input
    this.createAnimations();
    this.setupInput();
  }

  private createAnimations() {
    const scene = this.scene;

    // Create animations for the selected character based on proper TexturePacker format
    if (!scene.anims.exists(`${this.character}-idle`)) {
      scene.anims.create({
        key: `${this.character}-idle`,
        frames: scene.anims.generateFrameNames(`${this.character}_idle`, {
          prefix: `${this.character}_idle_`,
          start: 0,
          end: 3,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(`${this.character}-run`)) {
      scene.anims.create({
        key: `${this.character}-run`,
        frames: scene.anims.generateFrameNames(this.character, {
          prefix: `${this.character}_run_`,
          start: 0,
          end: 7,
        }),
        frameRate: 12,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(`${this.character}-jump`)) {
      scene.anims.create({
        key: `${this.character}-jump`,
        frames: scene.anims.generateFrameNames(`${this.character}_jump`, {
          prefix: `${this.character}_jump_`,
          start: 0,
          end: 1,
        }),
        frameRate: 10,
        repeat: 0,
      });
    }

    // Special abilities
    if (this.character === 'aladdin' && !scene.anims.exists('aladdin-carpet')) {
      scene.anims.create({
        key: 'aladdin-carpet',
        frames: scene.anims.generateFrameNames('aladdin_carpet', {
          prefix: 'aladdin_carpet_',
          start: 0,
          end: 1,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }

    if (this.character === 'moana' && !scene.anims.exists('moana-water-dash')) {
      scene.anims.create({
        key: 'moana-water-dash',
        frames: scene.anims.generateFrameNames('moana_water_dash', {
          prefix: 'moana_water_',
          start: 0,
          end: 2,
        }),
        frameRate: 12,
        repeat: 0,
      });
    }

    // Start with idle animation
    this.play(`${this.character}-idle`);
  }

  private setupInput() {
    // Set up keyboard input
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.spaceKey = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  public update() {
    // Guard against missing body after scene switches
    if (!this.body) return;

    const body = this.body as any;

    // Check if grounded
    this.isGrounded = body.touching.down;

    // Handle horizontal movement
    if (this.cursors.left.isDown) {
      this.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.moveRight();
    } else {
      this.stopMoving();
    }

    // Handle jumping - use isDown for continuous input detection
    if (this.spaceKey.isDown && this.isGrounded) {
      this.jump();
    }

    // Handle special abilities
    if (this.cursors.up.isDown) {
      this.useSpecialAbility();
    }
  }

  public moveLeft() {
    if (!this.body) return;
    const body = this.body as any;
    body.setVelocityX(-200);
    this.setFlipX(true);
    if (this.isGrounded) {
      this.play(`${this.character}-run`, true);
    }
  }

  public moveRight() {
    if (!this.body) return;
    const body = this.body as any;
    body.setVelocityX(200);
    this.setFlipX(false);
    if (this.isGrounded) {
      this.play(`${this.character}-run`, true);
    }
  }

  public stopMoving() {
    if (!this.body) return;
    const body = this.body as any;
    body.setVelocityX(0);
    if (this.isGrounded) {
      this.play(`${this.character}-idle`, true);
    }
  }

  public jump() {
    if (!this.body) return;
    const body = this.body as any;
    if (this.isGrounded) {
      body.setVelocityY(-500);
      this.play(`${this.character}-jump`);
      // TODO(cursor): Play jump sound effect
    }
  }

  private useSpecialAbility() {
    if (!this.body) return;

    // Character-specific special abilities
    if (this.character === 'aladdin') {
      // Carpet glide - slower fall
      const body = this.body as any;
      if (body.velocity.y > 0) {
        body.setVelocityY(body.velocity.y * 0.7);
        this.play('aladdin-carpet', true);
      }
    } else if (this.character === 'moana') {
      // Water dash - horizontal boost
      const body = this.body as any;
      if (!this.isGrounded) {
        body.setVelocityX(body.velocity.x > 0 ? 300 : -300);
        this.play('moana-water-dash', true);
      }
    }
  }
}
