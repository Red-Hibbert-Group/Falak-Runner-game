import * as Phaser from 'phaser';
import { Player } from '../prefabs/Player';
import { getGameState } from '../store/GameStore';

export class Level1Scene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private treasureChest!: Phaser.Physics.Arcade.Sprite;
  
  // Parallax layers
  private farBackground!: Phaser.GameObjects.TileSprite;
  private midGround!: Phaser.GameObjects.TileSprite;
  private nearForeground!: Phaser.GameObjects.TileSprite;
  
  // Mobile controls
  private leftBtn!: Phaser.GameObjects.Rectangle;
  private rightBtn!: Phaser.GameObjects.Rectangle;
  private jumpBtn!: Phaser.GameObjects.Rectangle;
  private leftPressed = false;
  private rightPressed = false;
  
  // UI
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'Level1Scene' });
  }

  init(data: { character: 'aladdin' | 'moana' }) {
    // Character selection data from TitleScene
    this.data.set('character', data.character || 'aladdin');
  }

  create() {
    const { width, height } = this.scale;
    
    this.createParallaxBackground();
    this.createGround();
    this.createPlayer();
    this.createCollectibles();
    this.createMobileControls();
    this.createUI();
    this.setupCollisions();
    
    // Set camera to follow player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, width * 3, height); // 3x wider world
  }

  private createParallaxBackground() {
    const { width, height } = this.scale;
    
    // Create parallax layers (will scroll at different speeds)
    this.farBackground = this.add.tileSprite(0, 0, width * 3, height, 'far-background');
    this.farBackground.setOrigin(0, 0);
    this.farBackground.setScrollFactor(0.1);
    
    this.midGround = this.add.tileSprite(0, 0, width * 3, height, 'mid-ground');
    this.midGround.setOrigin(0, 0);
    this.midGround.setScrollFactor(0.5);
    
    this.nearForeground = this.add.tileSprite(0, 0, width * 3, height, 'near-foreground');
    this.nearForeground.setOrigin(0, 0);
    this.nearForeground.setScrollFactor(0.8);
  }

  private createGround() {
    const { width, height } = this.scale;
    
    this.platforms = this.physics.add.staticGroup();
    
    // Create ground tiles using Stone_Walkway_Slice.png
    const groundY = height - 100; // Adjusted for better positioning
    const tileWidth = 128; // Adjusted based on actual asset size
    
    for (let x = 0; x < width * 3; x += tileWidth) {
      const tile = this.platforms.create(x + tileWidth / 2, groundY, 'stone-walkway');
      tile.setScale(0.8).refreshBody(); // Scale down slightly for better proportions
    }
  }

  private createPlayer() {
    const character = this.data.get('character') as 'aladdin' | 'moana';
    
    this.player = new Player({
      scene: this,
      x: 100,
      y: 300, // Adjusted Y position
      character: character,
    });
    
    // Scale player to appropriate size
    this.player.setScale(0.3); // Adjusted for baby characters
  }

  private createCollectibles() {
    this.collectibles = this.physics.add.group();
    
    // Add gifts (coins) at various positions
    const giftPositions = [
      { x: 400, y: 350 },
      { x: 700, y: 300 },
      { x: 1000, y: 250 },
      { x: 1300, y: 350 },
      { x: 1600, y: 300 },
      { x: 1900, y: 250 },
      { x: 2200, y: 350 },
    ];
    
    giftPositions.forEach(pos => {
      const gift = this.collectibles.create(pos.x, pos.y, 'gift');
      gift.setScale(0.1); // Scale down the large gift image
      gift.setBounce(0.3);
      gift.setCollideWorldBounds(true);
      
      // Add floating animation
      this.tweens.add({
        targets: gift,
        y: pos.y - 20,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
    
    // Add treasure chest at the end
    this.treasureChest = this.physics.add.sprite(2600, 350, 'treasure-chest');
    this.treasureChest.setScale(0.2); // Scale down the large treasure chest
    this.treasureChest.setImmovable(true);
    
    // Add glow effect to treasure chest
    this.tweens.add({
      targets: this.treasureChest,
      alpha: 0.7,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  private createMobileControls() {
    const { width, height } = this.scale;
    
    // Only create mobile controls on touch devices
    if (this.sys.game.device.input.touch) {
      // Left button
      this.leftBtn = this.add.rectangle(80, height - 80, 120, 80, 0x444444, 0.7);
      this.leftBtn.setScrollFactor(0);
      this.leftBtn.setInteractive();
      this.add.text(80, height - 80, '←', { fontSize: '40px', color: '#fff' })
        .setOrigin(0.5).setScrollFactor(0);
      
      // Right button
      this.rightBtn = this.add.rectangle(220, height - 80, 120, 80, 0x444444, 0.7);
      this.rightBtn.setScrollFactor(0);
      this.rightBtn.setInteractive();
      this.add.text(220, height - 80, '→', { fontSize: '40px', color: '#fff' })
        .setOrigin(0.5).setScrollFactor(0);
      
      // Jump button
      this.jumpBtn = this.add.rectangle(width - 80, height - 80, 120, 80, 0x444444, 0.7);
      this.jumpBtn.setScrollFactor(0);
      this.jumpBtn.setInteractive();
      this.add.text(width - 80, height - 80, '↑', { fontSize: '40px', color: '#fff' })
        .setOrigin(0.5).setScrollFactor(0);
      
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
    
    // Score
    this.scoreText = this.add.text(20, 20, `Score: ${gameState.score}`, {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.scoreText.setScrollFactor(0);
    
    // Lives
    this.livesText = this.add.text(20, 60, `Lives: ${gameState.lives}`, {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.livesText.setScrollFactor(0);
    
    // Character indicator
    const character = this.data.get('character') as 'aladdin' | 'moana';
    const characterName = character === 'aladdin' ? '🧞‍♂️ Aladdin' : '🌊 Moana';
    this.add.text(20, 100, characterName, {
      fontSize: '20px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2,
    }).setScrollFactor(0);
  }

  private setupCollisions() {
    // Player with ground
    this.physics.add.collider(this.player, this.platforms);
    
    // Collectibles with ground
    this.physics.add.collider(this.collectibles, this.platforms);
    
    // Player collecting gifts
    this.physics.add.overlap(this.player, this.collectibles, this.collectGift, undefined, this);
    
    // Player reaching treasure chest
    this.physics.add.overlap(this.player, this.treasureChest, this.reachTreasure, undefined, this);
  }

  private collectGift(player: any, gift: any) {
    gift.destroy();
    
    // Update score
    const gameState = getGameState();
    gameState.incrementScore(10);
    this.scoreText.setText(`Score: ${gameState.score}`);
    
    // TODO(cursor): Play coin collect sound effect
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
    // Create multiple firework particles
    for (let i = 0; i < 15; i++) {
      const firework = this.add.image(x, y, 'firework');
      firework.setScale(0.1); // Scale down the large firework image
      
      // Random firework animation
      this.tweens.add({
        targets: firework,
        x: x + Phaser.Math.Between(-100, 100),
        y: y + Phaser.Math.Between(-150, -50),
        scale: 0.3,
        alpha: 0,
        rotation: Phaser.Math.Between(0, Math.PI * 2),
        duration: 1500,
        ease: 'Quad.easeOut',
        onComplete: () => firework.destroy(),
      });
    }
  }

  update() {
    // Update player
    this.player.update();
    
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