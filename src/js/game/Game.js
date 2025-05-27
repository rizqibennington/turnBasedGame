import { Player } from './Player.js';
import { BattleSystem } from './BattleSystem.js';
import { Renderer } from './Renderer.js';
import { UI } from '../ui/UI.js';
import { AudioManager } from '../utils/AudioManager.js';

export class Game {
    constructor() {
        this.player1 = new Player(1, 'Player 1');
        this.player2 = new Player(2, 'Player 2');
        this.battleSystem = null;
        this.renderer = null;
        this.ui = null;
        this.audioManager = null;
        this.gameLoop = null;
        this.isRunning = false;
        
        this.initialize();
    }

    initialize() {
        // Initialize UI
        this.ui = new UI();
        this.bindUIEvents();
        
        // Initialize audio
        this.audioManager = new AudioManager();
        
        // Initialize canvas renderer
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            this.renderer = new Renderer(canvas);
        }
        
        // Start with character selection screen
        this.ui.showScreen('characterSelection');
        
        console.log('🎮 Turn-Based Battle Arena initialized!');
    }

    bindUIEvents() {
        // Character selection callback
        this.ui.onCharacterSelected = (player, characterClass) => {
            this.onCharacterSelected(player, characterClass);
        };

        // Battle action callback
        this.ui.onActionClick = (action) => {
            this.executePlayerAction(action);
        };

        // Start battle callback
        this.ui.onStartBattle = () => {
            this.startBattle();
        };

        // Play again callback
        this.ui.onPlayAgain = () => {
            this.restartBattle();
        };

        // New characters callback
        this.ui.onNewCharacters = () => {
            this.resetToCharacterSelection();
        };
    }

    onCharacterSelected(player, characterClass) {
        if (player === 'player1') {
            this.player1.selectCharacter(characterClass);
            console.log(`Player 1 selected: ${characterClass}`);
        } else if (player === 'player2') {
            this.player2.selectCharacter(characterClass);
            console.log(`Player 2 selected: ${characterClass}`);
        }
    }

    startBattle() {
        // Ensure both players have characters
        if (!this.player1.hasCharacter() || !this.player2.hasCharacter()) {
            console.error('Both players must select characters before starting battle');
            return;
        }

        // Initialize battle system
        this.battleSystem = new BattleSystem(this.player1, this.player2);
        
        // Switch to battle screen
        this.ui.showScreen('battleScreen');
        this.ui.clearBattleLog();
        
        // Start game loop
        this.startGameLoop();
        
        // Update UI with initial state
        this.updateUI();
        
        console.log('⚔️ Battle started!');
    }

    executePlayerAction(action) {
        if (!this.battleSystem || this.battleSystem.isGameOver) {
            return;
        }

        // Validate action
        if (!this.battleSystem.isValidAction(action)) {
            console.warn(`Invalid action: ${action}`);
            return;
        }

        // Execute action
        const result = this.battleSystem.executeAction(action);
        
        if (result.success) {
            // Play appropriate sound
            this.playActionSound(action, result.result);
            
            // Add to battle log
            const logEntries = this.battleSystem.getBattleLog();
            const latestEntry = logEntries[logEntries.length - 1];
            if (latestEntry) {
                this.ui.addToBattleLog(latestEntry.message);
            }
            
            // Trigger visual effects
            this.triggerVisualEffects(action, result.result);
            
            // Update UI
            this.updateUI();
            
            // Check for game over
            if (result.gameOver) {
                this.handleGameOver(result.winner);
            }
        }
    }

    playActionSound(action, result) {
        switch (action) {
            case 'attack':
                if (result.isCritical) {
                    this.audioManager.playCriticalSound();
                } else {
                    this.audioManager.playAttackSound();
                }
                this.audioManager.playDamageSound();
                break;
            case 'special':
                this.audioManager.playSpecialSound();
                this.audioManager.playDamageSound();
                break;
            case 'defend':
                this.audioManager.playDefendSound();
                break;
            case 'heal':
                this.audioManager.playHealSound();
                break;
        }
    }

    triggerVisualEffects(action, result) {
        if (!this.renderer) return;

        const currentPlayer = this.battleSystem.getCurrentPlayer();
        const opponent = this.battleSystem.getOpponent();
        
        const currentPos = currentPlayer === this.player1 ? 
            this.renderer.getPlayer1Position() : this.renderer.getPlayer2Position();
        const opponentPos = opponent === this.player1 ? 
            this.renderer.getPlayer1Position() : this.renderer.getPlayer2Position();

        switch (action) {
            case 'attack':
                this.renderer.animateAttack(currentPos, opponentPos);
                break;
            case 'special':
                this.renderer.animateSpecial(opponentPos, result.specialType);
                break;
            case 'heal':
                this.renderer.animateHeal(currentPos);
                break;
        }
    }

    handleGameOver(winner) {
        // Stop game loop
        this.stopGameLoop();
        
        // Play victory sound
        this.audioManager.playVictorySound();
        
        // Get battle statistics
        const battleStats = this.battleSystem.getBattleStatistics();
        
        // Show game over screen after a delay
        setTimeout(() => {
            this.ui.showGameOver(winner, battleStats);
        }, 2000);
        
        console.log(`🎉 Game Over! ${winner.name} wins!`);
    }

    restartBattle() {
        if (!this.battleSystem) return;
        
        // Reset battle system
        this.battleSystem.reset();
        
        // Switch back to battle screen
        this.ui.showScreen('battleScreen');
        this.ui.clearBattleLog();
        
        // Restart game loop
        this.startGameLoop();
        
        // Update UI
        this.updateUI();
        
        console.log('🔄 Battle restarted!');
    }

    resetToCharacterSelection() {
        // Stop game loop
        this.stopGameLoop();
        
        // Reset players
        this.player1 = new Player(1, 'Player 1');
        this.player2 = new Player(2, 'Player 2');
        
        // Reset battle system
        this.battleSystem = null;
        
        // Reset UI
        this.ui.resetCharacterSelection();
        this.ui.showScreen('characterSelection');
        
        console.log('🔄 Reset to character selection');
    }

    startGameLoop() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const gameLoop = () => {
            if (this.isRunning && this.renderer && this.battleSystem) {
                const gameState = this.battleSystem.getGameState();
                this.renderer.render(gameState);
            }
            
            if (this.isRunning) {
                this.gameLoop = requestAnimationFrame(gameLoop);
            }
        };
        
        gameLoop();
    }

    stopGameLoop() {
        this.isRunning = false;
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }

    updateUI() {
        if (!this.battleSystem) return;
        
        const gameState = this.battleSystem.getGameState();
        this.ui.updateBattleUI(gameState);
    }

    // Public methods for external control
    toggleMute() {
        return this.audioManager.toggleMute();
    }

    setVolume(volume) {
        this.audioManager.setVolume(volume);
    }

    getGameState() {
        return this.battleSystem ? this.battleSystem.getGameState() : null;
    }

    // Handle window resize
    handleResize() {
        if (this.renderer) {
            this.renderer.setupCanvas();
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        game.handleResize();
    });
    
    // Make game globally accessible for debugging
    window.game = game;
});
