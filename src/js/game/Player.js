import { Character } from './Character.js';

export class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.character = null;
        this.wins = 0;
        this.totalBattles = 0;
        this.isActive = false;
    }

    selectCharacter(characterType) {
        this.character = new Character(characterType, this.name);
        return this.character;
    }

    hasCharacter() {
        return this.character !== null;
    }

    getCharacter() {
        return this.character;
    }

    // Action methods that delegate to character
    attack(target) {
        if (!this.character || !this.character.isAlive()) {
            return { action: 'attack', success: false, reason: 'Character not available' };
        }
        return this.character.attack(target.getCharacter());
    }

    specialAttack(target) {
        if (!this.character || !this.character.isAlive()) {
            return { action: 'special', success: false, reason: 'Character not available' };
        }
        return this.character.specialAttack(target.getCharacter());
    }

    defend() {
        if (!this.character || !this.character.isAlive()) {
            return { action: 'defend', success: false, reason: 'Character not available' };
        }
        return this.character.defend();
    }

    heal() {
        if (!this.character || !this.character.isAlive()) {
            return { action: 'heal', success: false, reason: 'Character not available' };
        }
        return this.character.heal();
    }

    isAlive() {
        return this.character && this.character.isAlive();
    }

    canUseSpecial() {
        if (!this.character) return false;
        return this.character.currentMP >= this.character.getSpecialMPCost();
    }

    canHeal() {
        if (!this.character) return false;
        return this.character.currentMP >= 20 && this.character.currentHP < this.character.maxHP;
    }

    // Battle statistics
    addWin() {
        this.wins++;
        this.totalBattles++;
    }

    addLoss() {
        this.totalBattles++;
    }

    getWinRate() {
        if (this.totalBattles === 0) return 0;
        return (this.wins / this.totalBattles) * 100;
    }

    // Reset for new battle
    resetForBattle() {
        if (this.character) {
            this.character.reset();
        }
        this.isActive = false;
    }

    // Get player status for UI
    getStatus() {
        if (!this.character) {
            return {
                id: this.id,
                name: this.name,
                hasCharacter: false
            };
        }

        return {
            id: this.id,
            name: this.name,
            hasCharacter: true,
            character: {
                type: this.character.type,
                icon: this.character.icon,
                color: this.character.color,
                currentHP: this.character.currentHP,
                maxHP: this.character.maxHP,
                currentMP: this.character.currentMP,
                maxMP: this.character.maxMP,
                hpPercentage: this.character.getHPPercentage(),
                mpPercentage: this.character.getMPPercentage(),
                isAlive: this.character.isAlive(),
                isDefending: this.character.isDefending
            },
            stats: {
                wins: this.wins,
                totalBattles: this.totalBattles,
                winRate: this.getWinRate()
            }
        };
    }

    // Get available actions
    getAvailableActions() {
        if (!this.character || !this.character.isAlive()) {
            return [];
        }

        const actions = ['attack', 'defend'];
        
        if (this.canUseSpecial()) {
            actions.push('special');
        }
        
        if (this.canHeal()) {
            actions.push('heal');
        }

        return actions;
    }

    // Get action descriptions
    getActionDescription(action) {
        if (!this.character) return '';

        const descriptions = {
            attack: `Basic attack (${this.character.attack} base damage)`,
            special: `${this.character.getSpecialName()} (${this.character.getSpecialMPCost()} MP)`,
            defend: 'Defend and restore MP (+50% defense)',
            heal: 'Restore HP (20 MP, ~30% max HP)'
        };

        return descriptions[action] || '';
    }
}
