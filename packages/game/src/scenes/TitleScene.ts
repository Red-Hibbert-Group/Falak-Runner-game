// Use global Phaser from CDN
declare const Phaser: any;

export class TitleScene extends Phaser.Scene {
  private titleText!: any;
  private instructionText!: any;
  private spaceKey!: any;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    console.log('[TitleScene] create');
    const { width, height } = this.scale;

    // Fail-safe camera clear
    this.cameras.main.fadeIn(300, 0, 0, 0);

    // Debug text to verify scene loaded
    this.add.text(10, 10, 'TitleScene loaded', {
      fontSize: '16px',
      color: '#000000',
    });

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xffd700, 0xffd700);
    bg.fillRect(0, 0, width, height);

    // Game title - using percentage positioning for responsive design
    this.titleText = this.add
      .text(width * 0.5, height * 0.35, 'FALAK RUNNER', {
        fontSize: `${Math.min(width, height) * 0.08}px`,
        color: '#8B4513',
        fontStyle: 'bold',
        stroke: '#FFFFFF',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(width * 0.5, height * 0.45, 'Adventures of Baby Aladdin & Moana', {
        fontSize: `${Math.min(width, height) * 0.03}px`,
        color: '#4A4A4A',
        fontStyle: 'italic',
      })
      .setOrigin(0.5);

    // Instructions
    this.instructionText = this.add
      .text(width * 0.5, height * 0.65, '', {
        fontSize: `${Math.min(width, height) * 0.025}px`,
        color: '#333333',
        align: 'center',
      })
      .setOrigin(0.5);

    // Set instruction text based on platform
    if (this.sys.game.device.input.touch) {
      this.instructionText.setText('TAP TO PLAY');
    } else {
      this.instructionText.setText('PRESS SPACEBAR TO PLAY');
    }

    // Handle input - proceed to character selection
    this.input.once('pointerdown', () => {
      console.log('[TitleScene] pointerdown – start CharacterSelectScene');
      this.scene.start('CharacterSelectScene');
    });
    this.input.keyboard.once('keydown-SPACE', () => {
      console.log('[TitleScene] SPACE – start CharacterSelectScene');
      this.scene.start('CharacterSelectScene');
    });

    // Add blinking effect to instruction text
    this.tweens.add({
      targets: this.instructionText,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // TODO(cursor): Add character selection UI (Aladdin vs Moana)
    // For now, default to Aladdin
  }
}
