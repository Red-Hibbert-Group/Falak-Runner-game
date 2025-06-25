// Use global Phaser from CDN
declare const Phaser: any;

import { setChosenChar, getChosenChar } from '../store/GameStore';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create() {
    console.log('[CharacterSelectScene] create');
    const { width, height } = this.scale;

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xffd700, 0xffd700);
    bg.fillRect(0, 0, width, height);

    // Title
    this.add
      .text(width * 0.5, height * 0.2, 'Choose Your Adventurer', {
        fontSize: `${Math.min(width, height) * 0.06}px`,
        color: '#8B4513',
        fontStyle: 'bold',
        stroke: '#FFFFFF',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const spacing = Math.min(width, height) * 0.25;

    // Aladdin character button
    const alBtn = this.add
      .image(centerX - spacing, centerY, 'aladdin', 'aladdin_run_0')
      .setInteractive({ cursor: 'pointer' })
      .setScale(1.2);

    // Aladdin label
    this.add
      .text(centerX - spacing, centerY + 100, 'ALADDIN', {
        fontSize: `${Math.min(width, height) * 0.04}px`,
        color: '#8B4513',
        fontStyle: 'bold',
        stroke: '#FFFFFF',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Moana character button
    const moBtn = this.add
      .image(centerX + spacing, centerY, 'moana', 'moana_run_0')
      .setInteractive({ cursor: 'pointer' })
      .setScale(1.2);

    // Moana label
    this.add
      .text(centerX + spacing, centerY + 100, 'MOANA', {
        fontSize: `${Math.min(width, height) * 0.04}px`,
        color: '#8B4513',
        fontStyle: 'bold',
        stroke: '#FFFFFF',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(width * 0.5, height * 0.8, 'Click on your character to begin!', {
        fontSize: `${Math.min(width, height) * 0.03}px`,
        color: '#4A4A4A',
        fontStyle: 'italic',
      })
      .setOrigin(0.5);

    const startGame = () => {
      console.log(
        `[CharacterSelectScene] Starting game with character: ${getChosenChar()}`
      );
      this.scene.start('Level1Scene');
    };

    // Add hover effects
    alBtn.on('pointerover', () => {
      alBtn.setScale(1.3);
      alBtn.setTint(0xffff99);
    });
    alBtn.on('pointerout', () => {
      alBtn.setScale(1.2);
      alBtn.clearTint();
    });
    alBtn.on('pointerdown', () => {
      console.log('[CharacterSelectScene] Aladdin selected');
      setChosenChar('aladdin');
      startGame();
    });

    moBtn.on('pointerover', () => {
      moBtn.setScale(1.3);
      moBtn.setTint(0x99ffff);
    });
    moBtn.on('pointerout', () => {
      moBtn.setScale(1.2);
      moBtn.clearTint();
    });
    moBtn.on('pointerdown', () => {
      console.log('[CharacterSelectScene] Moana selected');
      setChosenChar('moana');
      startGame();
    });
  }
}
