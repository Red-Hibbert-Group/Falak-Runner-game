// Use global Phaser from CDN
declare const Phaser: any;

import { getGameState } from '../store/GameStore';

export class LevelCompleteScene extends Phaser.Scene {
  private spaceKey!: any;

  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  create() {
    const { width, height } = this.scale;
    const gameState = getGameState();

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x4a90e2, 0x4a90e2, 0x87ceeb, 0x87ceeb);
    bg.fillRect(0, 0, width, height);

    // Level Complete text
    this.add
      .text(width / 2, height / 2 - 150, 'LEVEL COMPLETE!', {
        fontSize: '48px',
        color: '#FFD700',
        fontStyle: 'bold',
        stroke: '#8B4513',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Congratulations text
    this.add
      .text(
        width / 2,
        height / 2 - 80,
        'Congratulations! You found the treasure!',
        {
          fontSize: '24px',
          color: '#FFFFFF',
          fontStyle: 'italic',
        }
      )
      .setOrigin(0.5);

    // Final score
    this.add
      .text(width / 2, height / 2 - 20, `Final Score: ${gameState.score}`, {
        fontSize: '32px',
        color: '#FFD700',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // TODO(cursor): Add level statistics (time, collectibles found, etc.)

    // Instructions
    const instructionText = this.add
      .text(width / 2, height / 2 + 80, '', {
        fontSize: '20px',
        color: '#FFFFFF',
        align: 'center',
      })
      .setOrigin(0.5);

    if (this.sys.game.device.input.touch) {
      instructionText.setText('TAP TO PLAY AGAIN');
      this.input.once('pointerdown', this.restartGame, this);
    } else {
      instructionText.setText('PRESS SPACEBAR TO PLAY AGAIN');
      this.spaceKey = this.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
      this.spaceKey.once('down', this.restartGame, this);
    }

    // Add blinking effect
    this.tweens.add({
      targets: instructionText,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Create celebration particles
    this.createCelebrationParticles();
  }

  private createCelebrationParticles() {
    const { width, height } = this.scale;

    // Create multiple firework particles
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(width * 0.2, width * 0.8);
      const y = Phaser.Math.Between(height * 0.2, height * 0.6);

      // Create particle emitter
      const particles = this.add.particles(x, y, 'firework', {
        speed: { min: 50, max: 150 },
        scale: { start: 0.3, end: 0 },
        blendMode: 'ADD',
        lifespan: 1000,
      });

      // Stop after 3 seconds
      this.time.delayedCall(3000, () => {
        particles.destroy();
      });
    }
  }

  private restartGame() {
    // Reset game state
    const gameState = getGameState();
    gameState.resetGame();

    // Go back to title screen
    this.scene.start('TitleScene');
  }
}
