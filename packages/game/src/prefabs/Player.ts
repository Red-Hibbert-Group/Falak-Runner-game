// Use global Phaser from CDN
declare const Phaser: any;

import { getChosenChar } from '../store/GameStore';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: any;
  private spaceKey?: any;
  private isOnGround: boolean = false;
  private runSpeed: number = 300;
  private jumpVelocity: number = 500;
  private specialKey: string;
  private chosenChar: string;

  constructor(scene: any, x: number, y: number) {
    // Get character choice from store
    const chosenChar = getChosenChar();
    console.log('[Player] Creating player with character:', chosenChar);

    // Call parent constructor with chosen character atlas
    super(scene, x, y, chosenChar, `${chosenChar}_run_0`);

    this.chosenChar = chosenChar;

    // Set special ability animation based on character
    this.specialKey =
      chosenChar === 'aladdin' ? 'aladdin_carpet' : 'moana_water_dash';

    // Add to scene and enable physics
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // Set up physics body with guard
    if (this.body) {
      const body = this.body as any;
      body.setCollideWorldBounds(true);
      body.setGravityY(0); // Gravity is handled by the physics world
      body.setSize(32, 48); // Adjust based on sprite size
      body.setOffset(16, 16); // Center the collision box
    }

    // Set initial depth
    this.setDepth(10);

    // Create animations if they don't exist
    this.createAnimations();

    // Set up input
    this.setupInput();

    // Start with idle animation
    this.playIdleAnimation();
  }

  private createAnimations() {
    const anims = this.scene.anims;
    const char = this.chosenChar;

    // Create run animation
    if (!anims.exists(`${char}_run`)) {
      anims.create({
        key: `${char}_run`,
        frames: anims.generateFrameNames(char, {
          prefix: `${char}_run_`,
          start: 0,
          end: 7,
        }),
        frameRate: 12,
        repeat: -1,
      });
    }

    // Create idle animation using first run frame
    if (!anims.exists(`${char}_idle`)) {
      anims.create({
        key: `${char}_idle`,
        frames: [{ key: char, frame: `${char}_run_0` }],
        frameRate: 1,
        repeat: 0,
      });
    }

    // Create jump animation using first run frame
    if (!anims.exists(`${char}_jump`)) {
      anims.create({
        key: `${char}_jump`,
        frames: [{ key: char, frame: `${char}_run_0` }],
        frameRate: 1,
        repeat: 0,
      });
    }

    // Create special ability animation if atlas exists
    if (this.scene.textures.exists(this.specialKey)) {
      if (!anims.exists(`${char}_special`)) {
        // Auto-detect frame count for special abilities
        const specials: Record<string, { prefix: string }> = {
          aladdin: { prefix: 'aladdin_carpet_' },
          moana: { prefix: 'moana_water_' },
        };

        const config = specials[char];
        if (config) {
          // Get the actual texture and count frames
          const texture = this.scene.textures.get(this.specialKey);
          const frameTotal = texture.frameTotal - 1; // subtract __BASE frame

          console.log(
            `[Player] ${char} special ability: ${frameTotal + 1} frames detected`
          );

          anims.create({
            key: `${char}_special`,
            frames: anims.generateFrameNames(this.specialKey, {
              prefix: config.prefix,
              start: 0,
              end: frameTotal,
            }),
            frameRate: 8,
            repeat: 0,
          });
        }
      }
    }
  }

  private setupInput() {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.spaceKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
    }
  }

  private playIdleAnimation() {
    if (this.anims) {
      this.anims.play(`${this.chosenChar}_idle`, true);
    }
  }

  private playRunAnimation() {
    if (this.anims) {
      this.anims.play(`${this.chosenChar}_run`, true);
    }
  }

  private playJumpAnimation() {
    if (this.anims) {
      this.anims.play(`${this.chosenChar}_jump`, true);
    }
  }

  private playSpecialAnimation() {
    if (this.anims && this.scene.textures.exists(this.specialKey)) {
      this.anims.play(`${this.chosenChar}_special`, true);
    }
  }

  update(cursors: any) {
    // Guard update when scene is paused or switched
    if (
      !this.active ||
      !this.body ||
      !this.scene ||
      !this.scene.scene.isActive()
    ) {
      return;
    }

    const body = this.body as any;

    // Handle horizontal movement
    if (cursors.left?.isDown) {
      body.setVelocityX(-this.runSpeed);
      this.setFlipX(true);
      if (this.isOnGround) {
        this.playRunAnimation();
      }
    } else if (cursors.right?.isDown) {
      body.setVelocityX(this.runSpeed);
      this.setFlipX(false);
      if (this.isOnGround) {
        this.playRunAnimation();
      }
    } else {
      body.setVelocityX(0);
      if (this.isOnGround) {
        this.playIdleAnimation();
      }
    }

    // Handle jumping
    if (cursors.up && cursors.up.isDown && this.isOnGround) {
      body.setVelocityY(-this.jumpVelocity);
      this.isOnGround = false;
      this.playJumpAnimation();
    }

    // Handle special ability (space key)
    if (this.spaceKey && this.spaceKey.isDown) {
      this.playSpecialAnimation();

      // Add special ability effects based on character
      if (this.chosenChar === 'aladdin') {
        // Carpet flying - temporary speed boost and jump
        body.setVelocityY(-300);
        body.setVelocityX(body.velocity.x * 1.5);
      } else if (this.chosenChar === 'moana') {
        // Water dash - horizontal dash
        const dashDirection = this.flipX ? -1 : 1;
        body.setVelocityX(dashDirection * 600);
      }
    }

    // Update ground status
    this.isOnGround = body.touching.down || body.blocked.down;

    // Update animation based on state
    if (!this.isOnGround && body.velocity.y > 0) {
      // Falling
      this.playJumpAnimation();
    }
  }

  // Method to handle collisions with ground
  onGroundCollision() {
    this.isOnGround = true;
  }

  // Method to handle item collection
  collectItem(points: number) {
    // This can be expanded to show collection effects
    console.log(`[Player] Collected item worth ${points} points`);
  }

  // Mobile control methods
  moveLeft() {
    if (!this.active || !this.body) return;

    const body = this.body as any;
    body.setVelocityX(-this.runSpeed);
    this.setFlipX(true);
    if (this.isOnGround) {
      this.playRunAnimation();
    }
  }

  moveRight() {
    if (!this.active || !this.body) return;

    const body = this.body as any;
    body.setVelocityX(this.runSpeed);
    this.setFlipX(false);
    if (this.isOnGround) {
      this.playRunAnimation();
    }
  }

  stopMoving() {
    if (!this.active || !this.body) return;

    const body = this.body as any;
    body.setVelocityX(0);
    if (this.isOnGround) {
      this.playIdleAnimation();
    }
  }

  jump() {
    if (!this.active || !this.body || !this.isOnGround) return;

    const body = this.body as any;
    body.setVelocityY(-this.jumpVelocity);
    this.isOnGround = false;
    this.playJumpAnimation();
  }
}
