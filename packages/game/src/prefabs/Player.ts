import * as Phaser from 'phaser';

export interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  character: 'aladdin' | 'moana';
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private isGrounded = false;
  private character: 'aladdin' | 'moana';
  
  // Mobile controls (will be created by the scene)
  public mobileControls?: {
    leftBtn: Phaser.GameObjects.Rectangle;
    rightBtn: Phaser.GameObjects.Rectangle;
    jumpBtn: Phaser.GameObjects.Rectangle;
  };

  constructor(config: PlayerConfig) {
    // Start with idle animation atlas
    super(config.scene, config.x, config.y, `${config.character}-idle`);
    
    this.character = config.character;
    
    // Add to scene
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this);
    
    // Set physics properties
    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setDragX(500);
    
    // Set collision box to 50% of sprite height (as requested)
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.width * 0.6, this.height * 0.5);
    body.setOffset(this.width * 0.2, this.height * 0.5);
    
    this.setupInput();
    this.createAnimations();
    
    // Start with idle animation
    this.play(`${this.character}-idle`);
  }

  private setupInput() {
    // Desktop controls
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.jumpKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  private createAnimations() {
    const animsManager = this.scene.anims;
    
    // Create idle animation
    if (!animsManager.exists(`${this.character}-idle`)) {
      if (this.character === 'aladdin') {
        animsManager.create({
          key: 'aladdin-idle',
          frames: animsManager.generateFrameNames('aladdin-idle', {
            prefix: 'aladdin_idle_3_',
            start: 0,
            end: 3,
          }),
          frameRate: 4,
          repeat: -1,
        });
      } else {
        animsManager.create({
          key: 'moana-idle',
          frames: animsManager.generateFrameNames('moana-idle', {
            prefix: 'moana_idle_3_',
            start: 0,
            end: 3,
          }),
          frameRate: 4,
          repeat: -1,
        });
      }
    }

    // Create run animation
    if (!animsManager.exists(`${this.character}-run`)) {
      if (this.character === 'aladdin') {
        animsManager.create({
          key: 'aladdin-run',
          frames: animsManager.generateFrameNames('aladdin', {
            prefix: 'aladdin_run_',
            start: 0,
            end: 7,
          }),
          frameRate: 12,
          repeat: -1,
        });
      } else {
        animsManager.create({
          key: 'moana-run',
          frames: animsManager.generateFrameNames('moana', {
            prefix: 'moana_run_',
            start: 0,
            end: 7,
          }),
          frameRate: 12,
          repeat: -1,
        });
      }
    }

    // Create jump animation
    if (!animsManager.exists(`${this.character}-jump`)) {
      if (this.character === 'aladdin') {
        animsManager.create({
          key: 'aladdin-jump',
          frames: animsManager.generateFrameNames('aladdin-jump', {
            prefix: 'aladdin_jump_3_',
            start: 0,
            end: 2,
          }),
          frameRate: 6,
          repeat: 0,
        });
      } else {
        animsManager.create({
          key: 'moana-jump',
          frames: animsManager.generateFrameNames('moana-jump', {
            prefix: 'moana_jump_3_',
            start: 0,
            end: 2,
          }),
          frameRate: 6,
          repeat: 0,
        });
      }
    }

    // Create special ability animation
    if (!animsManager.exists(`${this.character}-special`)) {
      if (this.character === 'aladdin') {
        animsManager.create({
          key: 'aladdin-special',
          frames: animsManager.generateFrameNames('aladdin-carpet', {
            prefix: 'aladdin_carpet_3_',
            start: 0,
            end: 2,
          }),
          frameRate: 8,
          repeat: -1,
        });
      } else {
        animsManager.create({
          key: 'moana-special',
          frames: animsManager.generateFrameNames('moana-water-dash', {
            prefix: 'moana_water_dash_3_',
            start: 0,
            end: 3,
          }),
          frameRate: 10,
          repeat: -1,
        });
      }
    }
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.isGrounded = body.touching.down;

    // Handle input
    let leftPressed = this.cursors.left.isDown;
    let rightPressed = this.cursors.right.isDown;
    let jumpPressed = Phaser.Input.Keyboard.JustDown(this.jumpKey);
    
    // Mobile controls override
    if (this.mobileControls) {
      // Mobile input will be handled by the scene
    }

    // Horizontal movement
    if (leftPressed) {
      body.setVelocityX(-200);
      this.setFlipX(true);
      if (this.isGrounded) {
        this.play(`${this.character}-run`, true);
      }
    } else if (rightPressed) {
      body.setVelocityX(200);
      this.setFlipX(false);
      if (this.isGrounded) {
        this.play(`${this.character}-run`, true);
      }
    } else {
      if (this.isGrounded) {
        this.play(`${this.character}-idle`, true);
      }
    }

    // Jumping
    if (jumpPressed && this.isGrounded) {
      body.setVelocityY(-400);
      this.play(`${this.character}-jump`, true);
    }

    // Handle falling animation
    if (!this.isGrounded && body.velocity.y > 0) {
      this.play(`${this.character}-jump`, true);
    }
  }

  // Methods for mobile controls
  public moveLeft() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(-200);
    this.setFlipX(true);
    if (this.isGrounded) {
      this.play(`${this.character}-run`, true);
    }
  }

  public moveRight() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(200);
    this.setFlipX(false);
    if (this.isGrounded) {
      this.play(`${this.character}-run`, true);
    }
  }

  public jump() {
    if (this.isGrounded) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setVelocityY(-400);
      this.play(`${this.character}-jump`, true);
    }
  }

  public stopMoving() {
    if (this.isGrounded) {
      this.play(`${this.character}-idle`, true);
    }
  }

  public useSpecialAbility() {
    // TODO(cursor): Implement special abilities
    // Aladdin: Carpet ride (temporary flight)
    // Moana: Water dash (speed boost)
    this.play(`${this.character}-special`, true);
  }
} 