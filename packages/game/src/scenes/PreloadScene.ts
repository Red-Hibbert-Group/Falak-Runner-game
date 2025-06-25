// Use global Phaser from CDN
declare const Phaser: any;

export class PreloadScene extends Phaser.Scene {
  private loadingBar!: any;
  private loadingBarBg!: any;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.createLoadingBar();

    // Static single-frame images
    const staticImages = [
      'far-background.png',
      'mid-ground.png',
      'near-foreground.png',
      'Stone_Walkway_Slice.png',
      'gift.png',
      'treasure_chest.png',
      'firework.png',
    ];

    // Sprite atlases
    const atlases = [
      { png: 'aladdin.png', json: 'aladdin.json' },
      { png: 'aladdin_idle.png', json: 'aladdin_idle.json' },
      { png: 'aladdin_jump.png', json: 'aladdin_jump.json' },
      { png: 'aladdin_carpet.png', json: 'aladdin_carpet.json' },
      { png: 'moana.png', json: 'moana.json' },
      { png: 'moana_idle.png', json: 'moana_idle.json' },
      { png: 'moana_jump.png', json: 'moana_jump.json' },
      { png: 'moana_water_dash.png', json: 'moana_water_dash.json' },
    ];

    // Load static images
    staticImages.forEach((file) => {
      this.load.image(file.replace(/\.png$/, ''), `/assets/${file}`);
    });

    // Load sprite atlases
    atlases.forEach(({ png, json }) => {
      const key = png.replace(/\.png$/, '');
      this.load.atlas(key, `/assets/${png}`, `/assets/${json}`);
    });

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
    this.add
      .text(width / 2, height / 2 - 60, 'Loading Falak Runner...', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Asset info text
    this.add
      .text(
        width / 2,
        height / 2 + 60,
        'Loading characters, backgrounds & magic!',
        {
          fontSize: '16px',
          color: '#cccccc',
        }
      )
      .setOrigin(0.5);
  }

  private updateLoadingBar(progress: number) {
    const { width, height } = this.scale;

    this.loadingBar.clear();
    this.loadingBar.fillStyle(0x00ff00);
    this.loadingBar.fillRect(
      width / 2 - 195,
      height / 2 - 20,
      390 * progress,
      40
    );
  }
}
