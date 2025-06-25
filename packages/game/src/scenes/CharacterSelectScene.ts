// Use global Phaser from CDN
declare const Phaser: any;

import { setChosenChar, getChosenChar } from '../store/GameStore';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create() {
    console.log('[CharacterSelectScene] create');

    // Add solid background
    this.cameras.main.setBackgroundColor('#0e397e'); // deep palace-blue
    this.cameras.main.fadeIn(300, 0, 0, 0);

    const { width, height } = this.scale;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Responsive scaling - max 40% viewport height for hero cards
    const maxCardHeight = height * 0.4;
    const cardScale = Math.min(maxCardHeight / 200, 1.5); // Limit max scale

    // Horizontal layout with proper spacing
    const spacing = Math.min(width * 0.3, 200);
    const agamPos = { x: centerX - spacing * 0.7, y: centerY };
    const nidhiPos = { x: centerX + spacing * 0.7, y: centerY };

    // Title at top
    this.add
      .text(centerX, height * 0.15, 'Choose Your Hero', {
        fontSize: Math.min(width * 0.08, 48) + 'px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // AGAM (Aladdin) button
    const agamButton = this.add
      .image(agamPos.x, agamPos.y, 'aladdin', 'aladdin_run_0')
      .setInteractive({ cursor: 'pointer' })
      .setScale(cardScale);

    // AGAM label
    this.add
      .text(agamPos.x, agamPos.y + cardScale * 100, 'AGAM', {
        fontSize: Math.min(width * 0.06, 32) + 'px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // NIDHI (Moana) button
    const nidhiButton = this.add
      .image(nidhiPos.x, nidhiPos.y, 'moana', 'moana_run_0')
      .setInteractive({ cursor: 'pointer' })
      .setScale(cardScale);

    // NIDHI label
    this.add
      .text(nidhiPos.x, nidhiPos.y + cardScale * 100, 'NIDHI', {
        fontSize: Math.min(width * 0.06, 32) + 'px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Instructions at bottom
    this.add
      .text(centerX, height * 0.85, 'Tap a hero to start!', {
        fontSize: Math.min(width * 0.05, 28) + 'px',
        color: '#fff',
      })
      .setOrigin(0.5);

    // Button hover effects with scale tweens
    agamButton.on('pointerover', () => {
      this.tweens.add({
        targets: agamButton,
        scale: cardScale * 1.1,
        duration: 200,
        ease: 'Power2',
      });
      agamButton.setTint(0xffff99);
    });

    agamButton.on('pointerout', () => {
      this.tweens.add({
        targets: agamButton,
        scale: cardScale,
        duration: 200,
        ease: 'Power2',
      });
      agamButton.clearTint();
    });

    nidhiButton.on('pointerover', () => {
      this.tweens.add({
        targets: nidhiButton,
        scale: cardScale * 1.1,
        duration: 200,
        ease: 'Power2',
      });
      nidhiButton.setTint(0x99ffff);
    });

    nidhiButton.on('pointerout', () => {
      this.tweens.add({
        targets: nidhiButton,
        scale: cardScale,
        duration: 200,
        ease: 'Power2',
      });
      nidhiButton.clearTint();
    });

    // Button click handlers
    agamButton.on('pointerdown', () => {
      console.log('[CharacterSelectScene] AGAM selected');
      this.selectCharacter('agam');
    });

    nidhiButton.on('pointerdown', () => {
      console.log('[CharacterSelectScene] NIDHI selected');
      this.selectCharacter('nidhi');
    });

    // Keyboard controls
    const cursors = this.input.keyboard?.createCursorKeys();
    const spaceKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    const enterKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    let selectedIndex = 0; // 0 = AGAM, 1 = NIDHI
    const characters = ['agam', 'nidhi'] as const;
    const buttons = [agamButton, nidhiButton];

    // Update selection highlight
    const updateSelection = () => {
      buttons.forEach((btn, i) => {
        if (i === selectedIndex) {
          this.tweens.add({
            targets: btn,
            scale: cardScale * 1.1,
            duration: 200,
            ease: 'Power2',
          });
          btn.setTint(i === 0 ? 0xffff99 : 0x99ffff);
        } else {
          this.tweens.add({
            targets: btn,
            scale: cardScale,
            duration: 200,
            ease: 'Power2',
          });
          btn.clearTint();
        }
      });
    };

    updateSelection(); // Set initial selection

    cursors?.left?.on('down', () => {
      selectedIndex = 0;
      updateSelection();
    });

    cursors?.right?.on('down', () => {
      selectedIndex = 1;
      updateSelection();
    });

    spaceKey?.on('down', () => {
      console.log(
        `[CharacterSelectScene] ${characters[selectedIndex]} selected via keyboard`
      );
      this.selectCharacter(characters[selectedIndex]);
    });

    enterKey?.on('down', () => {
      console.log(
        `[CharacterSelectScene] ${characters[selectedIndex]} selected via keyboard`
      );
      this.selectCharacter(characters[selectedIndex]);
    });
  }

  private selectCharacter(character: 'agam' | 'nidhi') {
    // Import GameStore at runtime to avoid circular dependencies
    import('../store/GameStore').then(({ setChosenChar, getChosenChar }) => {
      setChosenChar(character);
      console.log(`[CharacterSelectScene] picked ${character} – start Level1`);

      const chosenChar = getChosenChar();
      console.log(
        '[CharacterSelectScene] Starting game with character:',
        chosenChar
      );

      this.scene.start('Level1Scene');
    });
  }
}
