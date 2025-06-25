// Use global Phaser from CDN
declare const Phaser: any;

import { getGameState } from '../store/GameStore';

export class LevelCompleteScene extends Phaser.Scene {
  private spaceKey!: any;
  private birthdayText!: any;

  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  create() {
    const { width, height } = this.scale;
    const gameState = getGameState();

    // Fail-safe camera clear
    this.cameras.main.fadeIn(300, 0, 0, 0);

    // Background with celebration gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x533483);
    bg.fillRect(0, 0, width, height);

    // Level Complete text
    this.add
      .text(width / 2, height * 0.2, 'LEVEL COMPLETE!', {
        fontSize: Math.min(width * 0.1, 64) + 'px',
        color: '#FFD700',
        fontStyle: 'bold',
        stroke: '#8B4513',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Birthday message - start invisible
    this.birthdayText = this.add
      .text(
        width / 2,
        height * 0.45,
        'Happy Birthday\nNidhi Sree & Tirumala Agam!',
        {
          fontSize: Math.min(width * 0.08, 48) + 'px',
          color: '#FFFFFF',
          fontStyle: 'bold',
          align: 'center',
          stroke: '#FF69B4',
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);

    // Final score
    this.add
      .text(width / 2, height * 0.65, `Final Score: ${gameState.score}`, {
        fontSize: Math.min(width * 0.06, 36) + 'px',
        color: '#FFD700',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Instructions
    const instructionText = this.add
      .text(width / 2, height * 0.85, '', {
        fontSize: Math.min(width * 0.04, 24) + 'px',
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

    // Add blinking effect to instructions
    this.tweens.add({
      targets: instructionText,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Start the birthday animation sequence
    this.startBirthdayAnimation();

    // Auto-restart after 8 seconds
    this.time.delayedCall(8000, this.restartGame, [], this);
  }

  private startBirthdayAnimation() {
    const { width, height } = this.scale;

    // Create fireworks first
    this.createBirthdayFireworks();

    // Animate birthday text in with timeline
    this.tweens.timeline({
      targets: this.birthdayText,
      tweens: [
        {
          // Fade in
          alpha: 1,
          duration: 1200,
          ease: 'Sine.easeIn',
        },
        {
          // Subtle bounce scale
          scale: 1.1,
          duration: 400,
          ease: 'Back.easeOut',
          yoyo: true,
          repeat: 1,
        },
        {
          // Gentle glow pulse
          alpha: 0.8,
          duration: 800,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1,
        },
      ],
    });

    // Add sparkle effects around the birthday text
    this.createSparkleEffects();
  }

  private createBirthdayFireworks() {
    const { width, height } = this.scale;

    // Create multiple colorful firework bursts
    const colors = [0xff69b4, 0x00ff00, 0xffd700, 0xff4500, 0x9370db];

    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(width * 0.1, width * 0.9);
      const y = Phaser.Math.Between(height * 0.1, height * 0.7);
      const color = colors[i % colors.length];

      this.time.delayedCall(i * 300, () => {
        // Create burst effect
        const particles = this.add.particles(x, y, 'firework', {
          speed: { min: 100, max: 200 },
          scale: { start: 0.4, end: 0 },
          tint: color,
          blendMode: 'ADD',
          lifespan: 1500,
          quantity: 15,
        });

        // Stop after burst
        this.time.delayedCall(1500, () => {
          particles.destroy();
        });
      });
    }
  }

  private createSparkleEffects() {
    const { width, height } = this.scale;

    // Create continuous sparkles around the birthday text
    const sparkleEmitter = this.add.particles(
      width / 2,
      height * 0.45,
      'firework',
      {
        speed: { min: 20, max: 80 },
        scale: { start: 0.1, end: 0 },
        tint: [0xffd700, 0xff69b4, 0x00ff00, 0x9370db],
        blendMode: 'ADD',
        lifespan: 2000,
        frequency: 100,
        emitZone: {
          type: 'edge',
          source: new Phaser.Geom.Rectangle(-200, -50, 400, 100),
          quantity: 1,
        },
      }
    );

    // Stop sparkles after 6 seconds
    this.time.delayedCall(6000, () => {
      sparkleEmitter.destroy();
    });
  }

  private restartGame() {
    // Reset game state
    const gameState = getGameState();
    gameState.resetGame();

    // Go back to title screen
    this.scene.start('TitleScene');
  }
}
