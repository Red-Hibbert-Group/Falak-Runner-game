import * as Phaser from 'phaser';
import { getGameState } from '../store/GameStore';

export class LevelCompleteScene extends Phaser.Scene {
  private spaceKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  create() {
    const { width, height } = this.scale;
    const gameState = getGameState();

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x4A90E2, 0x4A90E2, 0x87CEEB, 0x87CEEB);
    bg.fillRect(0, 0, width, height);

    // Level Complete text
    this.add.text(width / 2, height / 2 - 150, 'LEVEL COMPLETE!', {
      fontSize: '48px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#8B4513',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Congratulations text
    this.add.text(width / 2, height / 2 - 80, 'Congratulations! You found the treasure!', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Final score
    this.add.text(width / 2, height / 2 - 20, `Final Score: ${gameState.score}`, {
      fontSize: '32px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // TODO(cursor): Add level statistics (time, collectibles found, etc.)
    
    // Instructions
    const instructionText = this.add.text(width / 2, height / 2 + 80, '', {
      fontSize: '20px',
      color: '#FFFFFF',
      align: 'center',
    }).setOrigin(0.5);

    if (this.sys.game.device.input.touch) {
      instructionText.setText('TAP TO PLAY AGAIN');
      this.input.once('pointerdown', this.restartGame, this);
    } else {
      instructionText.setText('PRESS SPACEBAR TO PLAY AGAIN');
      this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
    
    // Create random celebration particles
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 100, () => {
        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(0, height / 2);
        
        // Use firework image for particles
        const particle = this.add.image(x, y, 'firework');
        particle.setScale(0.3);
        particle.setAlpha(0.8);
        
        this.tweens.add({
          targets: particle,
          y: y + Phaser.Math.Between(100, 300),
          x: x + Phaser.Math.Between(-50, 50),
          scale: 0.8,
          alpha: 0,
          duration: 2000,
          ease: 'Quad.easeOut',
          onComplete: () => particle.destroy(),
        });
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