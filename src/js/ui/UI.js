export class UI {
    constructor() {
        this.currentScreen = 'character-selection';
        this.selectedCharacters = { player1: null, player2: null };
        this.battleLogContainer = null;
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Screen elements
        this.screens = {
            characterSelection: document.getElementById('character-selection'),
            battleScreen: document.getElementById('battle-screen'),
            gameOver: document.getElementById('game-over')
        };

        // Character selection elements
        this.player1Setup = document.getElementById('player1-setup');
        this.player2Setup = document.getElementById('player2-setup');
        this.startBattleBtn = document.getElementById('start-battle');
        this.p1Selected = document.getElementById('p1-selected');
        this.p2Selected = document.getElementById('p2-selected');

        // Battle UI elements
        this.turnIndicator = document.getElementById('turn-indicator');
        this.roundCounter = document.getElementById('round-counter');
        this.battleLogContainer = document.getElementById('battle-log');
        
        // Action buttons
        this.actionButtons = {
            attack: document.getElementById('attack-btn'),
            special: document.getElementById('special-btn'),
            defend: document.getElementById('defend-btn'),
            heal: document.getElementById('heal-btn')
        };

        // Player status elements
        this.playerStatus = {
            player1: {
                name: document.getElementById('p1-name'),
                portrait: document.getElementById('p1-portrait'),
                hpFill: document.getElementById('p1-hp-fill'),
                hpText: document.getElementById('p1-hp-text'),
                mpFill: document.getElementById('p1-mp-fill'),
                mpText: document.getElementById('p1-mp-text')
            },
            player2: {
                name: document.getElementById('p2-name'),
                portrait: document.getElementById('p2-portrait'),
                hpFill: document.getElementById('p2-hp-fill'),
                hpText: document.getElementById('p2-hp-text'),
                mpFill: document.getElementById('p2-mp-fill'),
                mpText: document.getElementById('p2-mp-text')
            }
        };

        // Game over elements
        this.winnerText = document.getElementById('winner-text');
        this.battleStats = document.getElementById('battle-stats');
        this.playAgainBtn = document.getElementById('play-again');
        this.newCharactersBtn = document.getElementById('new-characters');
    }

    bindEvents() {
        // Character selection events
        this.bindCharacterSelection();
        
        // Battle action events
        Object.keys(this.actionButtons).forEach(action => {
            this.actionButtons[action].addEventListener('click', () => {
                this.onActionClick(action);
            });
        });

        // Game over events
        this.playAgainBtn.addEventListener('click', () => {
            this.onPlayAgain();
        });

        this.newCharactersBtn.addEventListener('click', () => {
            this.onNewCharacters();
        });

        this.startBattleBtn.addEventListener('click', () => {
            this.onStartBattle();
        });
    }

    bindCharacterSelection() {
        // Player 1 character selection
        const p1Cards = this.player1Setup.querySelectorAll('.character-card');
        p1Cards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectCharacter('player1', card.dataset.class, card);
            });
        });

        // Player 2 character selection
        const p2Cards = this.player2Setup.querySelectorAll('.character-card');
        p2Cards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectCharacter('player2', card.dataset.class, card);
            });
        });
    }

    selectCharacter(player, characterClass, cardElement) {
        // Remove previous selection
        const playerSetup = player === 'player1' ? this.player1Setup : this.player2Setup;
        playerSetup.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Add selection to clicked card
        cardElement.classList.add('selected');
        
        // Store selection
        this.selectedCharacters[player] = characterClass;
        
        // Update selected character display
        this.updateSelectedCharacterDisplay(player, characterClass);
        
        // Check if both players have selected
        this.checkStartBattleAvailable();
        
        // Trigger callback if set
        if (this.onCharacterSelected) {
            this.onCharacterSelected(player, characterClass);
        }
    }

    updateSelectedCharacterDisplay(player, characterClass) {
        const characterInfo = {
            warrior: { icon: '🛡️', name: 'Warrior' },
            mage: { icon: '🔮', name: 'Mage' },
            archer: { icon: '🏹', name: 'Archer' }
        };

        const info = characterInfo[characterClass];
        const container = player === 'player1' ? this.p1Selected : this.p2Selected;
        
        container.innerHTML = `
            <div class="selected-info">
                <span class="selected-icon">${info.icon}</span>
                <span class="selected-name">${info.name}</span>
            </div>
        `;
    }

    checkStartBattleAvailable() {
        const bothSelected = this.selectedCharacters.player1 && this.selectedCharacters.player2;
        this.startBattleBtn.disabled = !bothSelected;
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
    }

    updateBattleUI(gameState) {
        // Update turn indicator
        if (gameState.currentPlayer) {
            this.turnIndicator.textContent = `${gameState.currentPlayer.name}'s Turn`;
        }

        // Update round counter
        this.roundCounter.textContent = `Round: ${gameState.round}`;

        // Update player status
        this.updatePlayerStatus('player1', gameState.player1Status);
        this.updatePlayerStatus('player2', gameState.player2Status);

        // Update action buttons
        this.updateActionButtons(gameState);
    }

    updatePlayerStatus(playerKey, status) {
        const elements = this.playerStatus[playerKey];
        
        if (status.hasCharacter) {
            elements.name.textContent = status.name;
            elements.portrait.textContent = status.character.icon;
            elements.portrait.style.background = `linear-gradient(45deg, ${status.character.color}, #ffffff)`;
            
            // Update HP bar
            elements.hpFill.style.width = `${status.character.hpPercentage}%`;
            elements.hpText.textContent = `${status.character.currentHP}/${status.character.maxHP}`;
            
            // Update MP bar
            elements.mpFill.style.width = `${status.character.mpPercentage}%`;
            elements.mpText.textContent = `${status.character.currentMP}/${status.character.maxMP}`;
        }
    }

    updateActionButtons(gameState) {
        const currentPlayer = gameState.currentPlayer;
        const isCurrentPlayerTurn = currentPlayer && !gameState.isGameOver;
        
        // Disable all buttons if not current player's turn or game over
        Object.values(this.actionButtons).forEach(btn => {
            btn.disabled = !isCurrentPlayerTurn;
        });

        if (isCurrentPlayerTurn) {
            const availableActions = currentPlayer.getAvailableActions();
            
            // Enable only available actions
            Object.keys(this.actionButtons).forEach(action => {
                this.actionButtons[action].disabled = !availableActions.includes(action);
            });

            // Update special button text with MP cost
            if (currentPlayer.getCharacter()) {
                const specialCost = currentPlayer.getCharacter().getSpecialMPCost();
                const specialName = currentPlayer.getCharacter().getSpecialName();
                this.actionButtons.special.innerHTML = `✨ ${specialName}<br><small>(${specialCost} MP)</small>`;
            }
        }
    }

    addToBattleLog(message) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = message;
        
        this.battleLogContainer.appendChild(logEntry);
        this.battleLogContainer.scrollTop = this.battleLogContainer.scrollHeight;
    }

    clearBattleLog() {
        if (this.battleLogContainer) {
            this.battleLogContainer.innerHTML = '<div class="log-entry">Battle begins!</div>';
        }
    }

    showGameOver(winner, battleStats) {
        this.winnerText.textContent = `${winner.name} Wins!`;
        
        // Display battle statistics
        this.battleStats.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <strong>Rounds:</strong> ${battleStats.rounds}
                </div>
                <div class="stat-item">
                    <strong>${battleStats.player1.name} (${battleStats.player1.character}):</strong>
                    <br>Damage Dealt: ${battleStats.player1.damageDealt}
                    <br>Damage Received: ${battleStats.player1.damageReceived}
                    <br>Actions Used: ${battleStats.player1.actionsUsed}
                </div>
                <div class="stat-item">
                    <strong>${battleStats.player2.name} (${battleStats.player2.character}):</strong>
                    <br>Damage Dealt: ${battleStats.player2.damageDealt}
                    <br>Damage Received: ${battleStats.player2.damageReceived}
                    <br>Actions Used: ${battleStats.player2.actionsUsed}
                </div>
            </div>
        `;
        
        this.showScreen('gameOver');
    }

    getSelectedCharacters() {
        return this.selectedCharacters;
    }

    resetCharacterSelection() {
        this.selectedCharacters = { player1: null, player2: null };
        
        // Clear all selections
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Clear selected displays
        this.p1Selected.innerHTML = '';
        this.p2Selected.innerHTML = '';
        
        // Disable start button
        this.startBattleBtn.disabled = true;
    }

    // Event callbacks (to be set by Game class)
    onCharacterSelected = null;
    onActionClick = null;
    onStartBattle = null;
    onPlayAgain = null;
    onNewCharacters = null;
}
