import * as Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private loadingBarBg!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.createLoadingBar();

    // Background layers
    this.load.image('far-background', '/assets/far-background.png');
    this.load.image('mid-ground', '/assets/mid-ground.png');
    this.load.image('near-foreground', '/assets/near-foreground.png');
    
    // Ground tile
    this.load.image('stone-walkway', '/assets/Stone_Walkway_Slice.png');
    
    // Collectibles
    this.load.image('gift', '/assets/gift.png');
    this.load.image('treasure-chest', '/assets/treasure_chest.png');
    
    // Effects
    this.load.image('firework', '/assets/firework.png');
    
    // Character main atlases (for run animation)
    this.load.atlas('aladdin', '/assets/aladdin.png', '/assets/aladdin.json');
    this.load.atlas('moana', '/assets/moana.png', '/assets/moana.json');
    
    // Individual animation atlases
    this.load.atlas('aladdin-idle', '/assets/aladdin_idle.png', '/assets/aladdin_idle.json');
    this.load.atlas('aladdin-jump', '/assets/aladdin_jump.png', '/assets/aladdin_jump.json');
    this.load.atlas('aladdin-carpet', '/assets/aladdin_carpet.png', '/assets/aladdin_carpet.json');
    
    this.load.atlas('moana-idle', '/assets/moana_idle.png', '/assets/moana_idle.json');
    this.load.atlas('moana-jump', '/assets/moana_jump.png', '/assets/moana_jump.json');
    this.load.atlas('moana-water-dash', '/assets/moana_water_dash.png', '/assets/moana_water_dash.json');

    // Update loading bar
    this.load.on('progress', (value: number) => {
      this.updateLoadingBar(value);
    });

    this.load.on('complete', () => {
      console.log('All assets loaded successfully!');
      this.scene.start('TitleScene');
    });

    this.load.on('loaderror', (file: any) => {
      console.error('Failed to load asset:', file.key, file.url);
    });
  }

  private createLoadingBar() {
    const { width, height } = this.scale;
    
    // Background bar
    this.loadingBarBg = this.add.graphics();
    this.loadingBarBg.fillStyle(0x666666);
    this.loadingBarBg.fillRect(width / 2 - 200, height / 2 - 25, 400, 50);
    
    // Loading bar
    this.loadingBar = this.add.graphics();
    
    // Loading text
    this.add.text(width / 2, height / 2 - 60, 'Loading Falak Runner...', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Asset info text
    this.add.text(width / 2, height / 2 + 60, 'Loading characters, backgrounds & magic!', {
      fontSize: '16px',
      color: '#cccccc',
    }).setOrigin(0.5);
  }

  private updateLoadingBar(progress: number) {
    const { width, height } = this.scale;
    
    this.loadingBar.clear();
    this.loadingBar.fillStyle(0x00ff00);
    this.loadingBar.fillRect(width / 2 - 195, height / 2 - 20, 390 * progress, 40);
  }
} 