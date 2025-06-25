// Use global Phaser from CDN
declare const Phaser: any;

import { setChosenChar, getChosenChar } from '../store/GameStore';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create() {
    console.log('[CharacterSelectScene] create');

    // Add solid background so never pure black
    this.cameras.main.setBackgroundColor('#0e397e'); // deep palace-blue

    // Fail-safe camera clear
    this.cameras.main.fadeIn(300, 0, 0, 0);

    const centerX = this.scale.width * 0.5;
    const centerY = this.scale.height * 0.55;

    // Responsive layout logic
    const horizontal = this.scale.width > 500; // wider than mobile portrait?
    const spacing = Math.min(this.scale.width * 0.25, 180);

    const alPos = horizontal
      ? { x: centerX - spacing, y: centerY }
      : { x: centerX, y: centerY - 120 };

    const moPos = horizontal
      ? { x: centerX + spacing, y: centerY }
      : { x: centerX, y: centerY + 120 };

    // Title
    this.add
      .text(centerX, centerY - (horizontal ? 180 : 220), 'Choose Your Hero', {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Aladdin button
    const aladdinButton = this.add
      .image(alPos.x, alPos.y, 'aladdin', 'aladdin_run_0')
      .setInteractive({ cursor: 'pointer' })
      .setScale(1.3);

    // Aladdin label
    this.add
      .text(alPos.x, alPos.y + 80, 'ALADDIN', {
        fontSize: '18px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Moana button
    const moanaButton = this.add
      .image(moPos.x, moPos.y, 'moana', 'moana_run_0')
      .setInteractive({ cursor: 'pointer' })
      .setScale(1.3);

    // Moana label
    this.add
      .text(moPos.x, moPos.y + 80, 'MOANA', {
        fontSize: '18px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // "Tap to start" helper
    this.add
      .text(
        centerX,
        centerY + (horizontal ? 150 : 210),
        'Tap a hero to start!',
        {
          fontSize: '24px',
          color: '#fff',
        }
      )
      .setOrigin(0.5);

    // Button hover effects
    aladdinButton.on('pointerover', () => {
      aladdinButton.setScale(1.4);
      aladdinButton.setTint(0xffff99);
    });

    aladdinButton.on('pointerout', () => {
      aladdinButton.setScale(1.3);
      aladdinButton.clearTint();
    });

    moanaButton.on('pointerover', () => {
      moanaButton.setScale(1.4);
      moanaButton.setTint(0x99ffff);
    });

    moanaButton.on('pointerout', () => {
      moanaButton.setScale(1.3);
      moanaButton.clearTint();
    });

    // Button click handlers
    aladdinButton.on('pointerdown', () => {
      console.log('[CharacterSelectScene] Aladdin selected');
      this.selectCharacter('aladdin');
    });

    moanaButton.on('pointerdown', () => {
      console.log('[CharacterSelectScene] Moana selected');
      this.selectCharacter('moana');
    });

    // Keyboard controls
    const cursors = this.input.keyboard?.createCursorKeys();
    const spaceKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    const enterKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    let selectedIndex = 0; // 0 = Aladdin, 1 = Moana
    const characters = ['aladdin', 'moana'];
    const buttons = [aladdinButton, moanaButton];

    // Update selection highlight
    const updateSelection = () => {
      buttons.forEach((btn, i) => {
        if (i === selectedIndex) {
          btn.setScale(1.4);
          btn.setTint(i === 0 ? 0xffff99 : 0x99ffff);
        } else {
          btn.setScale(1.3);
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
      this.selectCharacter(characters[selectedIndex] as 'aladdin' | 'moana');
    });

    enterKey?.on('down', () => {
      console.log(
        `[CharacterSelectScene] ${characters[selectedIndex]} selected via keyboard`
      );
      this.selectCharacter(characters[selectedIndex] as 'aladdin' | 'moana');
    });
  }

  private selectCharacter(character: 'aladdin' | 'moana') {
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
