export class Character {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.level = 1;

        // Initialize stats based on character type
        this.initializeStats();

        // Current stats (can change during battle)
        this.currentHP = this.maxHP;
        this.currentMP = this.maxMP;

        // Battle state
        this.isDefending = false;
        this.statusEffects = [];

        // Battle statistics
        this.damageDealt = 0;
        this.damageReceived = 0;
        this.actionsUsed = 0;
    }

    initializeStats() {
        const stats = {
            warrior: {
                maxHP: 120,
                maxMP: 30,
                attackPower: 25,
                defense: 20,
                speed: 15,
                criticalChance: 0.1,
                icon: '🛡️',
                color: '#ff6b6b'
            },
            mage: {
                maxHP: 80,
                maxMP: 100,
                attackPower: 30,
                defense: 10,
                speed: 20,
                criticalChance: 0.15,
                icon: '🔮',
                color: '#4ecdc4'
            },
            archer: {
                maxHP: 90,
                maxMP: 50,
                attackPower: 28,
                defense: 15,
                speed: 25,
                criticalChance: 0.25,
                icon: '🏹',
                color: '#00d4ff'
            }
        };

        const characterStats = stats[this.type];
        Object.assign(this, characterStats);
    }

    // Combat Actions
    attack(target) {
        this.actionsUsed++;
        const baseDamage = this.attackPower + Math.floor(Math.random() * 10) - 5;
        const isCritical = Math.random() < this.criticalChance;
        let damage = isCritical ? Math.floor(baseDamage * 1.5) : baseDamage;

        // Apply defense
        const defense = target.isDefending ? target.defense * 1.5 : target.defense;
        damage = Math.max(1, damage - Math.floor(defense / 2));

        const result = {
            action: 'attack',
            damage: damage,
            isCritical: isCritical,
            attacker: this.name,
            target: target.name
        };

        target.takeDamage(damage);
        this.damageDealt += damage;

        return result;
    }

    specialAttack(target) {
        const mpCost = this.getSpecialMPCost();
        if (this.currentMP < mpCost) {
            return { action: 'special', success: false, reason: 'Not enough MP' };
        }

        this.actionsUsed++;
        this.currentMP -= mpCost;

        let result;
        switch (this.type) {
            case 'warrior':
                result = this.berserkerStrike(target);
                break;
            case 'mage':
                result = this.fireball(target);
                break;
            case 'archer':
                result = this.multiShot(target);
                break;
        }

        return result;
    }

    defend() {
        this.actionsUsed++;
        this.isDefending = true;

        // Restore some MP when defending
        const mpRestore = Math.floor(this.maxMP * 0.1);
        this.currentMP = Math.min(this.maxMP, this.currentMP + mpRestore);

        return {
            action: 'defend',
            character: this.name,
            mpRestored: mpRestore
        };
    }

    heal() {
        const mpCost = 20;
        if (this.currentMP < mpCost) {
            return { action: 'heal', success: false, reason: 'Not enough MP' };
        }

        this.actionsUsed++;
        this.currentMP -= mpCost;

        const healAmount = Math.floor(this.maxHP * 0.3) + Math.floor(Math.random() * 10);
        const actualHeal = Math.min(healAmount, this.maxHP - this.currentHP);
        this.currentHP += actualHeal;

        return {
            action: 'heal',
            character: this.name,
            healAmount: actualHeal,
            success: true
        };
    }

    // Special Attacks
    berserkerStrike(target) {
        const damage = Math.floor(this.attackPower * 1.8) + Math.floor(Math.random() * 15);
        const adjustedDamage = Math.max(1, damage - Math.floor(target.defense / 3));

        target.takeDamage(adjustedDamage);
        this.damageDealt += adjustedDamage;

        return {
            action: 'special',
            specialType: 'berserkerStrike',
            damage: adjustedDamage,
            attacker: this.name,
            target: target.name,
            success: true
        };
    }

    fireball(target) {
        const damage = Math.floor(this.attackPower * 2.2) + Math.floor(Math.random() * 20);
        const adjustedDamage = Math.max(1, damage - Math.floor(target.defense / 4));

        target.takeDamage(adjustedDamage);
        this.damageDealt += adjustedDamage;

        return {
            action: 'special',
            specialType: 'fireball',
            damage: adjustedDamage,
            attacker: this.name,
            target: target.name,
            success: true
        };
    }

    multiShot(target) {
        const shots = 3;
        let totalDamage = 0;

        for (let i = 0; i < shots; i++) {
            const damage = Math.floor(this.attackPower * 0.7) + Math.floor(Math.random() * 8);
            const adjustedDamage = Math.max(1, damage - Math.floor(target.defense / 3));
            totalDamage += adjustedDamage;
        }

        target.takeDamage(totalDamage);
        this.damageDealt += totalDamage;

        return {
            action: 'special',
            specialType: 'multiShot',
            damage: totalDamage,
            shots: shots,
            attacker: this.name,
            target: target.name,
            success: true
        };
    }

    takeDamage(damage) {
        this.currentHP = Math.max(0, this.currentHP - damage);
        this.damageReceived += damage;
        this.isDefending = false; // Reset defense state after taking damage
    }

    isAlive() {
        return this.currentHP > 0;
    }

    getSpecialMPCost() {
        const costs = {
            warrior: 15,
            mage: 25,
            archer: 20
        };
        return costs[this.type];
    }

    getSpecialName() {
        const names = {
            warrior: 'Berserker Strike',
            mage: 'Fireball',
            archer: 'Multi Shot'
        };
        return names[this.type];
    }

    getHPPercentage() {
        return (this.currentHP / this.maxHP) * 100;
    }

    getMPPercentage() {
        return (this.currentMP / this.maxMP) * 100;
    }

    // Reset for new battle
    reset() {
        this.currentHP = this.maxHP;
        this.currentMP = this.maxMP;
        this.isDefending = false;
        this.statusEffects = [];
        this.damageDealt = 0;
        this.damageReceived = 0;
        this.actionsUsed = 0;
    }

    // Get character info for display
    getInfo() {
        return {
            name: this.name,
            type: this.type,
            icon: this.icon,
            color: this.color,
            maxHP: this.maxHP,
            maxMP: this.maxMP,
            attackPower: this.attackPower,
            defense: this.defense,
            speed: this.speed,
            criticalChance: this.criticalChance
        };
    }
}
