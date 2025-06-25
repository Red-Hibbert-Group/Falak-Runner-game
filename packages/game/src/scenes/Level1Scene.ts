// Use global Phaser from CDN
declare const Phaser: any;

import { Player } from '../prefabs/Player';
import { getGameState } from '../store/GameStore';

export class Level1Scene extends Phaser.Scene {
  private player!: Player;
  private platforms!: any;
  private collectibles!: any;
  private treasureChest!: any;

  // Parallax layers
  private farBackground!: any;
  private midGround!: any;
  private nearForeground!: any;

  // Mobile controls
  private leftBtn!: any;
  private rightBtn!: any;
  private jumpBtn!: any;
  private leftPressed = false;
  private rightPressed = false;

  // UI
  private scoreText!: any;
  private livesText!: any;

  constructor() {
    super({ key: 'Level1Scene' });
  }

  init(data: { character: 'aladdin' | 'moana' }) {
    // Character selection now handled by store, no need for init data
    console.log('[Level1Scene] init - character selection managed by store');
  }

  create() {
    console.log('[Level1Scene] create');
    const { width, height } = this.scale;

    // Fail-safe camera clear
    this.cameras.main.fadeIn(300, 0, 0, 0);

    // Debug text to verify scene loaded
    this.add
      .text(10, 50, 'Level1Scene loaded', {
        fontSize: '16px',
        color: '#000000',
      })
      .setScrollFactor(0);

    this.createParallaxBackground();
    this.createGround();
    this.createPlayer();
    this.createCollectibles();
    this.createMobileControls();
    this.createUI();
    this.setupCollisions();
    this.setupCamera();
    this.setupDepthOrdering();
  }

  private createParallaxBackground() {
    const { width, height } = this.scale;

    // Create parallax layers (will scroll at different speeds)
    this.farBackground = this.add.tileSprite(
      0,
      0,
      width * 3,
      height,
      'far-background'
    );
    this.farBackground.setOrigin(0, 0);
    this.farBackground.setScrollFactor(0.1);

    this.midGround = this.add.tileSprite(0, 0, width * 3, height, 'mid-ground');
    this.midGround.setOrigin(0, 0);
    this.midGround.setScrollFactor(0.5);

    this.nearForeground = this.add.tileSprite(
      0,
      0,
      width * 3,
      height,
      'near-foreground'
    );
    this.nearForeground.setOrigin(0, 0);
    this.nearForeground.setScrollFactor(0.8);
  }

  private createGround() {
    const { width, height } = this.scale;

    // Create static group for platforms (fixed physics group)
    this.platforms = this.physics.add.staticGroup();

    // Create ground tiles across the level
    const groundY = height - 64;
    const tileWidth = 128;
    const worldWidth = width * 3;

    for (let x = 0; x < worldWidth; x += tileWidth) {
      const tile = this.platforms.create(
        x + tileWidth / 2,
        groundY,
        'Stone_Walkway_Slice'
      );
      tile.setScale(2, 1);
      tile.refreshBody();
    }
  }

  private createPlayer() {
    const { height } = this.scale;

    this.player = new Player(this, 200, height - 200);
  }

  private createCollectibles() {
    const { width, height } = this.scale;

    // Create collectible group - NO gravity, immovable to prevent jitter
    this.collectibles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Add gifts scattered throughout the level
    const giftPositions = [
      { x: 400, y: height - 150 },
      { x: 600, y: height - 200 },
      { x: 900, y: height - 180 },
      { x: 1200, y: height - 160 },
      { x: 1500, y: height - 190 },
      { x: 1800, y: height - 170 },
      { x: 2100, y: height - 200 },
    ];

    giftPositions.forEach((pos) => {
      const gift = this.collectibles.create(pos.x, pos.y, 'gift');
      gift.setScale(0.1);
      // Remove bouncing since gifts are now immovable
      // gift.setBounce(0.3);

      // Stop gift flicker - disable collision detection to prevent separateOverlaps jitter
      gift.body.checkCollision.none = true;

      // Add floating animation
      this.tweens.add({
        targets: gift,
        y: pos.y - 20,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // Add treasure chest at the end
    this.treasureChest = this.physics.add.sprite(
      width * 2.8,
      height - 150,
      'treasure_chest'
    );
    this.treasureChest.setScale(0.3);
    this.treasureChest.body.setImmovable(true);
  }

  private createMobileControls() {
    const { width, height } = this.scale;

    // Only show mobile controls on touch devices
    if (this.sys.game.device.input.touch) {
      const buttonSize = Math.min(width, height) * 0.08;
      const buttonMargin = Math.min(width, height) * 0.05;

      // Left arrow button
      this.leftBtn = this.add.rectangle(
        buttonMargin + buttonSize / 2,
        height - buttonMargin - buttonSize / 2,
        buttonSize,
        buttonSize,
        0x4a90e2,
        0.7
      );
      this.leftBtn.setScrollFactor(0);
      this.leftBtn.setInteractive();
      this.add
        .text(
          buttonMargin + buttonSize / 2,
          height - buttonMargin - buttonSize / 2,
          '←',
          {
            fontSize: `${buttonSize * 0.5}px`,
            color: '#fff',
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);

      // Right arrow button
      this.rightBtn = this.add.rectangle(
        buttonMargin + buttonSize * 1.8,
        height - buttonMargin - buttonSize / 2,
        buttonSize,
        buttonSize,
        0x4a90e2,
        0.7
      );
      this.rightBtn.setScrollFactor(0);
      this.rightBtn.setInteractive();
      this.add
        .text(
          buttonMargin + buttonSize * 1.8,
          height - buttonMargin - buttonSize / 2,
          '→',
          {
            fontSize: `${buttonSize * 0.5}px`,
            color: '#fff',
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);

      // Jump button
      this.jumpBtn = this.add.rectangle(
        width - buttonMargin - buttonSize / 2,
        height - buttonMargin - buttonSize / 2,
        buttonSize,
        buttonSize,
        0xff6b6b,
        0.7
      );
      this.jumpBtn.setScrollFactor(0);
      this.jumpBtn.setInteractive();
      this.add
        .text(
          width - buttonMargin - buttonSize / 2,
          height - buttonMargin - buttonSize / 2,
          '↑',
          {
            fontSize: `${buttonSize * 0.5}px`,
            color: '#fff',
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);

      this.setupMobileInput();
    }
  }

  private setupMobileInput() {
    // Left button
    this.leftBtn.on('pointerdown', () => {
      this.leftPressed = true;
    });
    this.leftBtn.on('pointerup', () => {
      this.leftPressed = false;
    });
    this.leftBtn.on('pointerout', () => {
      this.leftPressed = false;
    });

    // Right button
    this.rightBtn.on('pointerdown', () => {
      this.rightPressed = true;
    });
    this.rightBtn.on('pointerup', () => {
      this.rightPressed = false;
    });
    this.rightBtn.on('pointerout', () => {
      this.rightPressed = false;
    });

    // Jump button
    this.jumpBtn.on('pointerdown', () => {
      this.player.jump();
    });
  }

  private createUI() {
    const gameState = getGameState();

    // Score text
    this.scoreText = this.add.text(20, 20, `Score: ${gameState.score}`, {
      fontSize: '24px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.scoreText.setScrollFactor(0);

    // Lives text
    this.livesText = this.add.text(20, 60, `Lives: ${gameState.lives}`, {
      fontSize: '20px',
      color: '#FF6B6B',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.livesText.setScrollFactor(0);
  }

  private setupCollisions() {
    // Player with ground
    this.physics.add.collider(this.player, this.platforms);

    // Remove collectibles collision with ground to prevent jitter
    // this.physics.add.collider(this.collectibles, this.platforms);

    // Player collecting gifts - use overlap instead of collider
    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.collectGift,
      undefined,
      this
    );

    // Player reaching treasure chest
    this.physics.add.overlap(
      this.player,
      this.treasureChest,
      this.reachTreasure,
      undefined,
      this
    );
  }

  private setupCamera() {
    const { width, height } = this.scale;

    // Camera follow with smooth lerp
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, width * 3, height);
  }

  private setupDepthOrdering() {
    // Set depth ordering to prevent flickering
    this.platforms.setDepth(1);
    this.collectibles.setDepth(5);
    this.player.setDepth(10);
    this.treasureChest.setDepth(8);
  }

  private collectGift(player: any, gift: any) {
    gift.destroy();

    // Update score
    const gameState = getGameState();
    gameState.incrementScore(10);
    this.scoreText.setText(`Score: ${gameState.score}`);

    console.log('Collected gift! +10 points');
  }

  private reachTreasure(player: any, treasure: any) {
    // Create fireworks particle effect
    this.createFireworks(treasure.x, treasure.y);

    // Transition to level complete scene
    this.time.delayedCall(2000, () => {
      this.scene.start('LevelCompleteScene');
    });
  }

  private createFireworks(x: number, y: number) {
    // Create simple firework effect
    for (let i = 0; i < 10; i++) {
      const firework = this.add.image(x, y, 'firework');
      firework.setScale(0.2);

      this.tweens.add({
        targets: firework,
        x: x + Phaser.Math.Between(-100, 100),
        y: y + Phaser.Math.Between(-100, 100),
        alpha: 0,
        scale: 0.5,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => firework.destroy(),
      });
    }
  }

  update() {
    // Update player with cursors
    if (this.input.keyboard) {
      const cursors = this.input.keyboard.createCursorKeys();
      this.player.update(cursors);
    }

    // Handle mobile controls
    if (this.leftPressed) {
      this.player.moveLeft();
    } else if (this.rightPressed) {
      this.player.moveRight();
    } else if (!this.leftPressed && !this.rightPressed) {
      this.player.stopMoving();
    }

    // Update parallax backgrounds based on camera position
    const camera = this.cameras.main;
    this.farBackground.tilePositionX = camera.scrollX * 0.1;
    this.midGround.tilePositionX = camera.scrollX * 0.5;
    this.nearForeground.tilePositionX = camera.scrollX * 0.8;
  }
}
