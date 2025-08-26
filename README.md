
# The Messenger's Path

**Full Disclosure:** This is a game I've completely vibe-coded as a fun experiment, paying homage to the text-based adventure games of the DOS era. While it's not perfect, I hope it inspires you to bring back text adventures with depth in story and branching choices.

## Overview
A modern, immersive text adventure game playable in your browser or CLI. Navigate branching choices, manage stats, and uncover clues as you journey through a world inspired by classic DOS-era adventures.

Navigate through **6 immersive chapters** including:
- **Prologue**: Character creation and backstory
- **Chapter 1: The Crossing** - Ferry trials and Captain Istra's challenges
- **Isle Selection** - Choose your path through 4 unique isles
- **Chapter 2: The Iron Isle (Warrior's Isle)** - Honor-bound culture with strength challenges and martial trials
- **Chapter 3: The Whispers Isle** - Secretive society where truth must be pieced from gossip and lies
- **Chapter 4: The Ashen Isle (Merchant's Isle)** - Pragmatic traders where loyalty can be bought and sold
- **Chapter 5: The Veilbreak Isle** - Deceptively hospitable false allies hiding dangerous secrets
- **Chapter 6: The Convergence** - Epic finale bringing all threads together

## ✨ Latest Features (v0.3.0)
- **Enhanced Narrative Immersion**: All player choices now display descriptive outcome text
- **Randomized Trials**: Captain's trials in Chapter 1 now truly randomize (Sabotage, Storm, Stowaway)
- **Isle Visit Prevention**: Smart logic prevents revisiting completed isles
- **Restart Functionality**: Seamless game restart with fresh randomization
- **Accessibility Options**: Added nervous/hesitate choices for inclusive gameplay
- **Chapter + Scene Titles**: Enhanced UI showing full context (e.g., "Chapter 1: The Crossing - The Storm")
- **Improved RNG System**: Proper seed management for consistent yet varied gameplay

## Core Features
- **Dual Interface**: Playable in web browser (static HTML/JS/CSS) or CLI (Node.js/TypeScript)
- **Branching Storylines**: Meaningful choices that affect story progression and outcomes
- **Character Development**: Wit, Charm, and Might stats that unlock different dialogue options
- **Rich Inventory System**: Coins, items, knowledge, and ally management
- **Choice Requirements**: Stat-gated options that reward character specialization
- **Save/Load System**: Progress persistence across sessions (CLI version)
- **Modern, Accessible UI**: Clean terminal-inspired design with keyboard shortcuts

## 🎮 Getting Started

### Web Browser (Recommended)
1. **Clone this repository:**
   ```sh
   git clone https://github.com/techiedip/The-Messengers-Path.git
   cd The-Messengers-Path
   ```

2. **Install dependencies:**
   ```sh
   npm install --no-save serve
   ```

3. **Start the local server:**
   ```sh
   npx serve webui -l 3000
   ```

4. **Open your browser to:** [http://localhost:3000](http://localhost:3000)

### CLI Interface
1. **Build the TypeScript project:**
   ```sh
   npm run build
   ```

2. **Run the CLI version:**
   ```sh
   npm run dev
   # or directly: node dist/index.js
   ```

### 🌐 Online Play
Visit the [GitHub Pages site](https://techiedip.github.io/The-Messengers-Path/) to play directly in your browser without any setup!

## 🎯 Gameplay Tips
- **Character Creation**: Choose your starting stat boost wisely - it affects available options throughout the game
- **Exploration Strategy**: Each isle offers unique challenges and rewards
- **Resource Management**: Balance coins, items, and relationships for optimal outcomes
- **Save Often**: Use `:s` to save your progress in CLI mode
- **Experimentation**: Try different character builds and choice combinations for varied experiences

## 🏝️ Isle Guide
Each isle presents unique cultures, challenges, and mechanics. Choose your path wisely:

### **The Iron Isle (Warrior's Isle)** - Strength/Glory
- **Culture**: Loud, honor-bound society that values martial prowess
- **NPCs**: Speak openly about their beliefs, but loyalty hinges on martial values
- **Challenges**: Strength tests, duels, boasting contests, and trials of courage
- **Strategy**: High Might stat recommended; direct approach often succeeds

### **The Whispers Isle** - Intrigue/Suspicion  
- **Culture**: Secretive society where everyone speaks in half-truths
- **NPCs**: Share information through gossip, rumors, and coded language
- **Challenges**: Wit-based puzzles, hidden knowledge checks, deduction mysteries
- **Strategy**: High Wit stat essential; piece truth from contradictory accounts

### **The Ashen Isle (Merchant's Isle)** - Greed/Deals
- **Culture**: Pragmatic traders focused on profit and practical exchanges
- **NPCs**: Loyalty can be bought; valuable hints buried in barter and debt discussions
- **Challenges**: Economic puzzles, item trades, bribery opportunities, market negotiations
- **Strategy**: Coin management crucial; Charm helps in negotiations

### **The Veilbreak Isle** - False Ally/Deception
- **Culture**: Outwardly hospitable but secretly loyal to dark forces
- **NPCs**: Give subtle red flags through contradictions and over-eagerness
- **Challenges**: Detect lies, paranoia tests, trust vs. suspicion decisions
- **Strategy**: **Danger**: Misreading the situation leads to capture; high Wit helps detect deception

## 🏗️ Project Structure
```
The-Messengers-Path/
├── webui/                 # Web Interface
│   ├── index.html        # Main game page
│   ├── app.js           # Game logic and UI
│   ├── assets/          # CSS, images, icons
│   └── content/         # JSON story files
├── src/                  # TypeScript Engine
│   ├── index.ts         # CLI entry point
│   ├── engine/          # Game logic (SceneRouter, RNG, etc.)
│   ├── io/              # Input/Output handling
│   ├── model/           # Type definitions
│   └── content/         # JSON story files (synced with webui)
├── docs/                # Documentation and design notes
└── dist/               # Compiled TypeScript output
```

## 🔧 Technical Details
- **Frontend**: Vanilla JavaScript with modern ES6+ features
- **Backend**: TypeScript with Node.js for CLI experience
- **Content**: JSON-based story definition with rich metadata
- **Build System**: TypeScript compiler with ESLint for code quality
- **Deployment**: GitHub Pages for web version, npm scripts for development

## 🎨 Game Design Philosophy
- **Player Agency**: Every choice matters and affects the narrative
- **Accessibility**: Multiple difficulty options and clear requirement indicators  
- **Replayability**: Randomized elements and branching paths encourage multiple playthroughs
- **Immersion**: Rich descriptive text that responds to player actions
- **Classic Inspiration**: Honoring DOS-era adventures while embracing modern UX

## 🤝 Contributing
This is a passion project, but contributions are welcome! Areas for improvement:
- Additional story branches and content
- UI/UX enhancements
- Bug fixes and performance improvements
- Accessibility features
- Mobile optimization

## 📋 Development Commands
```sh
npm run build          # Compile TypeScript
npm run dev           # Run CLI version
npm run lint          # Check code style
npx serve webui -l 3000  # Start web server
```

## 📜 License
MIT

---

*"Every choice is a step on the messenger's path. Choose wisely, traveler."*

### Recent Updates
- **v0.3.0** (August 2025): Complete Chapter 1 narrative overhaul with enhanced choice descriptions, randomized trials, and accessibility improvements
- **v0.2.x**: Core game mechanics, isle selection system, and web UI implementation  
- **v0.1.x**: Initial CLI version with basic story progression

🎮 **Ready to begin your journey?** [Play now](https://techiedip.github.io/The-Messengers-Path/) or clone the repo to start locally!
