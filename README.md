# 🧞‍♂️ Falak Runner 🌊

A magical 2D side-scrolling adventure game featuring baby Aladdin and Moana, built with Next.js 15, TypeScript, Tailwind CSS, and Phaser 3.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 🏗️ Architecture

This is a pnpm workspace monorepo with the following structure:

```
falak-runner/
├── packages/
│   └── game/          # Pure Phaser 3 game logic (TypeScript)
├── apps/
│   └── web/           # Next.js 15 front-end app
├── public/
│   └── assets/        # Game assets (PNG/JSON files)
└── package.json       # Root workspace configuration
```

## 🎮 Game Features

### ✅ Implemented

- **Monorepo Structure**: pnpm workspace with game package and web app
- **Asset Loading**: Automatic loading from `/public/assets` with progress bar
- **Scene Management**: Title → Level1 → Level Complete flow
- **Player Character**: Baby Aladdin with run, idle, jump animations
- **Physics**: Arcade physics with gravity and collisions
- **Parallax Background**: 3-layer scrolling backgrounds
- **Collectibles**: Gift pickups worth 10 points each
- **Level Completion**: Treasure chest triggers fireworks and completion
- **Controls**:
  - Desktop: Arrow keys + spacebar
  - Mobile: On-screen touch controls
- **State Management**: Zustand store for score, lives, level tracking

### 🚧 TODO (Stretch Goals)

- **Character Selection**: Moana with water dash ability
- **Sound Effects**: Coin pickup, jump, background music
- **Leaderboard**: Supabase integration for high scores
- **Multiple Levels**: Additional challenging levels
- **Power-ups**: Special abilities and temporary boosts
- **Mobile Optimization**: Better responsive controls

## 🎨 Asset Requirements

Place these files in `/public/assets/`:

### Backgrounds

- `far-background.png` - Distant background layer
- `mid-ground.png` - Middle ground layer
- `near-foreground.png` - Near foreground layer

### Characters

- `aladdin.png` + `aladdin.json` - Aladdin sprite atlas
- `moana.png` + `moana.json` - Moana sprite atlas

### Environment

- `Stone_Walkway_Slice.png` - Ground tile

### Collectibles

- `gift.png` - Coin/gift pickup
- `treasure-chest.png` - Level end goal
- `firework.png` - Celebration particle

## 🛠️ Development

### Tech Stack

- **Frontend**: Next.js 15 App Router, TypeScript, Tailwind CSS
- **Game Engine**: Phaser 3
- **State Management**: Zustand
- **Build Tool**: pnpm workspaces
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky for pre-commit linting

### Commands

```bash
# Development
pnpm dev              # Start both game and web in watch mode
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm format           # Format code with Prettier

# Individual packages
cd packages/game && pnpm build    # Build game package only
cd apps/web && pnpm dev           # Start web app only
```

### Game Architecture

The game follows a clean separation of concerns:

1. **packages/game/**: Pure Phaser game logic
   - `Game.ts`: Main game configuration and startup
   - `scenes/`: Individual game scenes (Preload, Title, Level1, etc.)
   - `prefabs/`: Reusable game objects (Player, etc.)
   - `store/`: Game state management

2. **apps/web/**: Next.js integration
   - Dynamic imports to avoid SSR issues
   - Responsive design with Tailwind
   - Zustand for UI state management

## 🎯 Game Flow

1. **Preload Scene**: Loads all assets with progress bar
2. **Title Scene**: Shows game title with "Tap to Play"
3. **Level 1 Scene**: Main gameplay with:
   - Parallax scrolling backgrounds
   - Physics-based character movement
   - Collectible gifts (+10 points each)
   - Treasure chest goal (triggers completion)
4. **Level Complete Scene**: Celebration with fireworks, shows final score

## 🎮 Controls

### Desktop

- ← → Arrow keys: Move left/right
- Spacebar: Jump
- Spacebar: Confirm/Start (in menus)

### Mobile

- On-screen buttons: Left/Right movement
- Jump button: Character jump
- Tap: Confirm/Start (in menus)

## 🚀 Deployment

The app is ready for deployment on Vercel, Netlify, or any static hosting:

```bash
pnpm build
```

The built files will be in `apps/web/.next/` and can be deployed directly.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass and code is formatted
5. Submit a pull request

## 📝 License

This project is for educational purposes. Game assets and characters are inspired by Disney's Aladdin and Moana.
