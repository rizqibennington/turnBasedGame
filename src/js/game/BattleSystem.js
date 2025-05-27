export class BattleSystem {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = null;
        this.round = 1;
        this.battleLog = [];
        this.isGameOver = false;
        this.winner = null;
        
        // Determine turn order based on speed
        this.determineTurnOrder();
    }

    determineTurnOrder() {
        const p1Speed = this.player1.getCharacter().speed;
        const p2Speed = this.player2.getCharacter().speed;
        
        if (p1Speed >= p2Speed) {
            this.currentPlayer = this.player1;
            this.player1.isActive = true;
        } else {
            this.currentPlayer = this.player2;
            this.player2.isActive = true;
        }
        
        this.addToLog(`Battle begins! ${this.currentPlayer.name} goes first!`);
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getOpponent(player = this.currentPlayer) {
        return player === this.player1 ? this.player2 : this.player1;
    }

    executeAction(action) {
        if (this.isGameOver) {
            return { success: false, reason: 'Game is over' };
        }

        const currentPlayer = this.currentPlayer;
        const opponent = this.getOpponent();
        let result;

        switch (action) {
            case 'attack':
                result = currentPlayer.attack(opponent);
                break;
            case 'special':
                result = currentPlayer.specialAttack(opponent);
                break;
            case 'defend':
                result = currentPlayer.defend();
                break;
            case 'heal':
                result = currentPlayer.heal();
                break;
            default:
                return { success: false, reason: 'Invalid action' };
        }

        // Add to battle log
        this.processBattleResult(result);

        // Check for game over
        this.checkGameOver();

        // Switch turns if game is not over
        if (!this.isGameOver) {
            this.switchTurn();
        }

        return {
            success: true,
            result: result,
            gameOver: this.isGameOver,
            winner: this.winner,
            currentPlayer: this.currentPlayer,
            round: this.round
        };
    }

    processBattleResult(result) {
        let logMessage = '';

        switch (result.action) {
            case 'attack':
                if (result.isCritical) {
                    logMessage = `💥 ${result.attacker} lands a CRITICAL HIT on ${result.target} for ${result.damage} damage!`;
                } else {
                    logMessage = `⚔️ ${result.attacker} attacks ${result.target} for ${result.damage} damage!`;
                }
                break;

            case 'special':
                if (!result.success) {
                    logMessage = `❌ ${this.currentPlayer.name} tried to use special attack but ${result.reason}!`;
                } else {
                    const specialNames = {
                        berserkerStrike: '🔥 Berserker Strike',
                        fireball: '🔥 Fireball',
                        multiShot: '🏹 Multi Shot'
                    };
                    const specialName = specialNames[result.specialType] || 'Special Attack';
                    logMessage = `✨ ${result.attacker} uses ${specialName} on ${result.target} for ${result.damage} damage!`;
                }
                break;

            case 'defend':
                logMessage = `🛡️ ${result.character} takes a defensive stance and restores ${result.mpRestored} MP!`;
                break;

            case 'heal':
                if (!result.success) {
                    logMessage = `❌ ${this.currentPlayer.name} tried to heal but ${result.reason}!`;
                } else {
                    logMessage = `❤️ ${result.character} heals for ${result.healAmount} HP!`;
                }
                break;
        }

        this.addToLog(logMessage);
    }

    checkGameOver() {
        if (!this.player1.isAlive()) {
            this.isGameOver = true;
            this.winner = this.player2;
            this.player2.addWin();
            this.player1.addLoss();
            this.addToLog(`🎉 ${this.player2.name} wins the battle!`);
        } else if (!this.player2.isAlive()) {
            this.isGameOver = true;
            this.winner = this.player1;
            this.player1.addWin();
            this.player2.addLoss();
            this.addToLog(`🎉 ${this.player1.name} wins the battle!`);
        }
    }

    switchTurn() {
        // Reset defending state for current player
        if (this.currentPlayer.getCharacter()) {
            this.currentPlayer.getCharacter().isDefending = false;
        }

        // Switch active player
        this.currentPlayer.isActive = false;
        this.currentPlayer = this.getOpponent();
        this.currentPlayer.isActive = true;

        // Check if we completed a full round
        if (this.currentPlayer === this.player1 || this.currentPlayer === this.player2) {
            // Determine who should go first this round based on speed
            const p1Speed = this.player1.getCharacter().speed;
            const p2Speed = this.player2.getCharacter().speed;
            
            if (this.currentPlayer === this.player1 && p1Speed < p2Speed) {
                this.round++;
            } else if (this.currentPlayer === this.player2 && p2Speed < p1Speed) {
                this.round++;
            }
        }
    }

    addToLog(message) {
        this.battleLog.push({
            round: this.round,
            message: message,
            timestamp: Date.now()
        });
    }

    getBattleLog() {
        return this.battleLog;
    }

    getGameState() {
        return {
            round: this.round,
            currentPlayer: this.currentPlayer,
            player1Status: this.player1.getStatus(),
            player2Status: this.player2.getStatus(),
            isGameOver: this.isGameOver,
            winner: this.winner,
            battleLog: this.battleLog
        };
    }

    getBattleStatistics() {
        const p1Char = this.player1.getCharacter();
        const p2Char = this.player2.getCharacter();

        return {
            rounds: this.round,
            winner: this.winner ? this.winner.name : 'None',
            player1: {
                name: this.player1.name,
                character: p1Char.type,
                damageDealt: p1Char.damageDealt,
                damageReceived: p1Char.damageReceived,
                actionsUsed: p1Char.actionsUsed,
                finalHP: p1Char.currentHP,
                survived: p1Char.isAlive()
            },
            player2: {
                name: this.player2.name,
                character: p2Char.type,
                damageDealt: p2Char.damageDealt,
                damageReceived: p2Char.damageReceived,
                actionsUsed: p2Char.actionsUsed,
                finalHP: p2Char.currentHP,
                survived: p2Char.isAlive()
            }
        };
    }

    // Reset battle for rematch
    reset() {
        this.player1.resetForBattle();
        this.player2.resetForBattle();
        this.round = 1;
        this.battleLog = [];
        this.isGameOver = false;
        this.winner = null;
        this.determineTurnOrder();
    }

    // Get available actions for current player
    getCurrentPlayerActions() {
        if (this.isGameOver) return [];
        return this.currentPlayer.getAvailableActions();
    }

    // Check if action is valid for current player
    isValidAction(action) {
        const availableActions = this.getCurrentPlayerActions();
        return availableActions.includes(action);
    }
}
