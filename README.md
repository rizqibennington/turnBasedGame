# 🎮 Turn-Based Battle Arena

A modern, interactive turn-based strategy game built with HTML5 Canvas and JavaScript. Choose your warrior, engage in tactical combat, and prove your strategic prowess!

![Game Preview](https://img.shields.io/badge/Status-Complete-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![CSS3](https://img.shields.io/badge/CSS3-Modern-blue)

## 🚀 Live Demo

[Play the Game](https://rizqibennington.github.io/turn-based-battle-arena/)

## ✨ Features

### 🎯 Core Gameplay
- **Turn-based combat system** with strategic depth
- **Three unique character classes** with distinct abilities
- **Dynamic battle animations** using HTML5 Canvas
- **Real-time battle statistics** and damage tracking
- **Responsive design** that works on all devices

### 🛡️ Character Classes
- **Warrior** 🛡️ - High HP, strong physical attacks, defensive capabilities
- **Mage** 🔮 - Powerful magic spells, high MP, devastating special attacks
- **Archer** 🏹 - Fast and agile, high critical hit chance, multi-shot abilities

### 🎨 Visual & Audio
- **Stunning visual effects** with particle systems
- **Procedural sound effects** using Web Audio API
- **Smooth animations** and transitions
- **Modern UI design** with glassmorphism effects
- **Dynamic lighting** and character portraits

### 🎮 Game Mechanics
- **Action Point system** with MP management
- **Special abilities** unique to each character class
- **Defensive mechanics** with blocking and damage reduction
- **Healing system** for strategic resource management
- **Critical hit system** for exciting combat moments

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Graphics**: HTML5 Canvas API
- **Audio**: Web Audio API for procedural sound generation
- **Build Tool**: Vite for modern development workflow
- **Deployment**: GitHub Pages

## 🏗️ Project Structure

```
turn-based-battle-arena/
├── src/
│   ├── js/
│   │   ├── game/
│   │   │   ├── Game.js          # Main game controller
│   │   │   ├── Player.js        # Player management
│   │   │   ├── Character.js     # Character classes & abilities
│   │   │   ├── BattleSystem.js  # Combat logic & turn management
│   │   │   └── Renderer.js      # Canvas rendering & animations
│   │   ├── ui/
│   │   │   └── UI.js           # User interface management
│   │   └── utils/
│   │       └── AudioManager.js  # Sound effects & music
│   ├── css/
│   │   └── styles.css          # Modern styling with animations
│   └── assets/                 # Game assets (expandable)
├── index.html                  # Main HTML file
├── package.json               # Project configuration
├── vite.config.js            # Build configuration
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rizqibennington/turn-based-battle-arena.git
   cd turn-based-battle-arena
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Deploying to GitHub Pages

```bash
npm run deploy
```

## 🎮 How to Play

### Character Selection
1. **Choose your fighter** - Each player selects from Warrior, Mage, or Archer
2. **Review stats** - Check HP, MP, Attack, and special abilities
3. **Start the battle** - Click "Start Battle!" when both players are ready

### Combat System
- **Attack** ⚔️ - Basic physical attack with chance for critical hits
- **Special** ✨ - Unique ability that consumes MP (varies by class)
- **Defend** 🛡️ - Reduce incoming damage and restore MP
- **Heal** ❤️ - Restore HP using MP (available when damaged)

### Victory Conditions
- Reduce your opponent's HP to 0
- Strategic use of abilities and resource management is key!

## 🎯 Game Design Principles

### Object-Oriented Architecture
- **Modular design** with clear separation of concerns
- **Reusable components** for easy expansion
- **Clean interfaces** between game systems

### Performance Optimization
- **Efficient rendering** with requestAnimationFrame
- **Memory management** for smooth gameplay
- **Responsive design** for all screen sizes

### User Experience
- **Intuitive controls** with clear visual feedback
- **Engaging animations** that enhance gameplay
- **Accessibility features** for inclusive gaming

## 🔧 Development Features

### Modern JavaScript
- ES6+ modules and classes
- Async/await patterns
- Clean, maintainable code structure

### Build System
- Vite for fast development and building
- Hot module replacement for instant updates
- Optimized production builds

### Code Quality
- Consistent coding standards
- Comprehensive error handling
- Extensible architecture for future features

## 🎨 Customization

The game is designed to be easily customizable:

### Adding New Characters
1. Extend the `Character` class with new stats
2. Add character data to the initialization
3. Create new special abilities
4. Update UI with new character options

### Visual Modifications
- Modify `styles.css` for different themes
- Update `Renderer.js` for new visual effects
- Add new particle systems and animations

### Audio Enhancements
- Extend `AudioManager.js` with new sounds
- Add background music support
- Implement dynamic audio mixing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style
2. Add comments for complex logic
3. Test your changes thoroughly
4. Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by classic turn-based RPGs
- Designed for portfolio demonstration
- Created with passion for game development

## 📊 Project Stats

- **Lines of Code**: ~2000+
- **Files**: 10+ organized modules
- **Features**: 15+ gameplay mechanics
- **Responsive**: Mobile and desktop ready
- **Performance**: 60 FPS smooth animations

---

**Made with ❤️ by [rizqibennington](https://github.com/rizqibennington)**

*This project showcases modern JavaScript development, game programming concepts, and clean architecture principles.*
