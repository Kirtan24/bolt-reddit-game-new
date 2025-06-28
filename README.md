# Chain Reaction - Strategic Orb Game

A strategic orb placement game built with Bolt x Devvit for Reddit's Developer Platform.

## About

Chain Reaction is a strategic game where you place orbs on a grid to trigger explosive chain reactions. Battle against an intelligent AI opponent across three difficulty levels. The goal is to eliminate all enemy orbs through strategic placement and chain reactions.

## Features

- **Strategic Gameplay**: Plan your moves carefully to trigger maximum chain reactions
- **AI Opponent**: Battle against intelligent AI with three difficulty levels
- **Chain Reactions**: Watch orbs explode in cascading effects
- **Responsive Design**: Optimized for all devices
- **Sound Effects**: Immersive audio feedback
- **Dynamic Colors**: Random color schemes for each game

## Getting Started

This template is made specifically to work with **Bolt.new** and Reddit's Developer Platform.

### Step 1: Authentication
```bash
npm run login
```
Follow the instructions in the terminal to authenticate with Reddit.

### Step 2: App Initialization
```bash
npm run devvit:init
```
Follow the instructions to set up your app remotely.

### Step 3: Subreddit Configuration
1. Create a test subreddit on Reddit
2. Update `YOUR_SUBREDDIT_NAME` in the `dev:devvit` script in `package.json`
3. Replace it with your subreddit name (without the r/)

### Step 4: Start Development
```bash
npm run dev
```

## How to Play

1. **Choose Difficulty**: Select Easy, Medium, or Hard
2. **Place Orbs**: Click empty cells or your own orbs to add more
3. **Trigger Reactions**: When orbs reach critical mass (4), they explode
4. **Chain Effects**: Explosions spread to neighboring cells
5. **Win Condition**: Eliminate all enemy orbs

## Game Rules

- Each cell has a critical mass of 4 orbs
- When a cell reaches critical mass, it explodes and spreads orbs to adjacent cells
- Explosions can trigger chain reactions
- You can only place orbs in empty cells or cells you own
- The game ends when one player has no orbs remaining

## Project Structure

```
src/
├── devvit/          # Reddit app integration
├── client/          # React frontend
├── server/          # Node.js backend
└── shared/          # Shared types and utilities
```

## Technologies Used

- **React**: Frontend framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Devvit**: Reddit platform integration
- **Vite**: Build tool
- **Web Audio API**: Sound effects

## Deployment

The project is deployment-ready with:
- Optimized build configuration
- Progressive loading screens
- SEO-optimized HTML
- Mobile-responsive design
- Reddit platform integration

## License

BSD-3-Clause

---

Built with Bolt x Devvit