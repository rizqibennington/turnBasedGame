export class UI {
    constructor() {
        this.currentScreen = 'character-selection';
        this.selectedCharacters = { player1: null, player2: null };
        this.battleLogContainer = null;

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        console.log('🔧 Initializing UI elements...');

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

        // Debug: Check if critical elements exist
        console.log('Character selection elements:', {
            player1Setup: !!this.player1Setup,
            player2Setup: !!this.player2Setup,
            startBattleBtn: !!this.startBattleBtn,
            p1Selected: !!this.p1Selected,
            p2Selected: !!this.p2Selected
        });

        // Battle UI elements
        this.turnIndicator = document.getElementById('turn-indicator');
        this.roundCounter = document.getElementById('round-counter');
        this.battleLogContainer = document.getElementById('battle-log');

        // Player action buttons
        this.player1Actions = {
            attack: document.getElementById('p1-attack-btn'),
            special: document.getElementById('p1-special-btn'),
            defend: document.getElementById('p1-defend-btn'),
            heal: document.getElementById('p1-heal-btn')
        };

        this.player2Actions = {
            attack: document.getElementById('p2-attack-btn'),
            special: document.getElementById('p2-special-btn'),
            defend: document.getElementById('p2-defend-btn'),
            heal: document.getElementById('p2-heal-btn')
        };

        // Player action containers
        this.player1ActionsContainer = document.getElementById('p1-actions');
        this.player2ActionsContainer = document.getElementById('p2-actions');

        // Audio controls
        this.muteBtn = document.getElementById('mute-btn');

        // Debug: Check if buttons were found
        console.log('🔍 Player 1 Action buttons found:');
        Object.keys(this.player1Actions).forEach(action => {
            const button = this.player1Actions[action];
            console.log(`  P1 ${action}:`, button ? '✅ Found' : '❌ Not found');
        });

        console.log('🔍 Player 2 Action buttons found:');
        Object.keys(this.player2Actions).forEach(action => {
            const button = this.player2Actions[action];
            console.log(`  P2 ${action}:`, button ? '✅ Found' : '❌ Not found');
        });

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

        // Bind events after all elements are initialized
        this.bindEvents();
    }

    bindEvents() {
        console.log('🎯 bindEvents() called');
        // Character selection events
        this.bindCharacterSelection();

        // Player 1 action events
        Object.keys(this.player1Actions).forEach(action => {
            const button = this.player1Actions[action];
            if (button) {
                console.log(`🎯 Binding P1 ${action} button event`);
                button.addEventListener('click', () => {
                    console.log(`🎮 P1 ${action} button clicked!`);
                    if (this.onActionClick) {
                        this.onActionClick(action, 1); // Pass player ID
                    } else {
                        console.error('❌ onActionClick callback not set!');
                    }
                });
            } else {
                console.error(`❌ P1 ${action} button not found!`);
            }
        });

        // Player 2 action events
        Object.keys(this.player2Actions).forEach(action => {
            const button = this.player2Actions[action];
            if (button) {
                console.log(`🎯 Binding P2 ${action} button event`);
                button.addEventListener('click', () => {
                    console.log(`🎮 P2 ${action} button clicked!`);
                    if (this.onActionClick) {
                        this.onActionClick(action, 2); // Pass player ID
                    } else {
                        console.error('❌ onActionClick callback not set!');
                    }
                });
            } else {
                console.error(`❌ P2 ${action} button not found!`);
            }
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

        // Audio control events
        if (this.muteBtn) {
            this.muteBtn.addEventListener('click', () => {
                if (this.onMuteToggle) {
                    const isMuted = this.onMuteToggle();
                    this.updateMuteButton(isMuted);
                }
            });
        }
    }

    bindCharacterSelection() {
        console.log('🎯 Binding character selection events...');

        if (!this.player1Setup || !this.player2Setup) {
            console.error('❌ Player setup elements not found!');
            return;
        }

        // Player 1 character selection
        const p1Cards = this.player1Setup.querySelectorAll('.character-card');
        console.log(`Found ${p1Cards.length} Player 1 character cards`);
        p1Cards.forEach((card, index) => {
            console.log(`Binding P1 card ${index}:`, card.dataset.class);
            card.addEventListener('click', () => {
                console.log(`P1 clicked: ${card.dataset.class}`);
                this.selectCharacter('player1', card.dataset.class, card);
            });
        });

        // Player 2 character selection
        const p2Cards = this.player2Setup.querySelectorAll('.character-card');
        console.log(`Found ${p2Cards.length} Player 2 character cards`);
        p2Cards.forEach((card, index) => {
            console.log(`Binding P2 card ${index}:`, card.dataset.class);
            card.addEventListener('click', () => {
                console.log(`P2 clicked: ${card.dataset.class}`);
                this.selectCharacter('player2', card.dataset.class, card);
            });
        });

        console.log('✅ Character selection events bound successfully');
    }

    selectCharacter(player, characterClass, cardElement) {
        console.log(`🎮 Selecting character: ${player} -> ${characterClass}`);

        // Remove previous selection
        const playerSetup = player === 'player1' ? this.player1Setup : this.player2Setup;
        playerSetup.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Add selection to clicked card
        cardElement.classList.add('selected');

        // Store selection
        this.selectedCharacters[player] = characterClass;
        console.log('Current selections:', this.selectedCharacters);

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
        const isPlayer1Turn = currentPlayer && currentPlayer.id === 1;
        const isPlayer2Turn = currentPlayer && currentPlayer.id === 2;

        // Enable/disable player action containers based on turn
        if (this.player1ActionsContainer) {
            if (isPlayer1Turn) {
                this.player1ActionsContainer.classList.remove('disabled');
            } else {
                this.player1ActionsContainer.classList.add('disabled');
            }
        }

        if (this.player2ActionsContainer) {
            if (isPlayer2Turn) {
                this.player2ActionsContainer.classList.remove('disabled');
            } else {
                this.player2ActionsContainer.classList.add('disabled');
            }
        }

        // Update Player 1 buttons
        if (isPlayer1Turn && currentPlayer.getCharacter()) {
            const availableActions = currentPlayer.getAvailableActions();
            Object.keys(this.player1Actions).forEach(action => {
                const button = this.player1Actions[action];
                if (button) {
                    button.disabled = !availableActions.includes(action);
                }
            });

            // Update special button text with MP cost
            const specialCost = currentPlayer.getCharacter().getSpecialMPCost();
            const specialName = currentPlayer.getCharacter().getSpecialName();
            if (this.player1Actions.special) {
                this.player1Actions.special.innerHTML = `✨ ${specialName}<br><small>(${specialCost} MP)</small>`;
            }
        } else {
            // Disable all Player 1 buttons
            Object.values(this.player1Actions).forEach(btn => {
                if (btn) btn.disabled = true;
            });
        }

        // Update Player 2 buttons
        if (isPlayer2Turn && currentPlayer.getCharacter()) {
            const availableActions = currentPlayer.getAvailableActions();
            Object.keys(this.player2Actions).forEach(action => {
                const button = this.player2Actions[action];
                if (button) {
                    button.disabled = !availableActions.includes(action);
                }
            });

            // Update special button text with MP cost
            const specialCost = currentPlayer.getCharacter().getSpecialMPCost();
            const specialName = currentPlayer.getCharacter().getSpecialName();
            if (this.player2Actions.special) {
                this.player2Actions.special.innerHTML = `✨ ${specialName}<br><small>(${specialCost} MP)</small>`;
            }
        } else {
            // Disable all Player 2 buttons
            Object.values(this.player2Actions).forEach(btn => {
                if (btn) btn.disabled = true;
            });
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

    updateMuteButton(isMuted) {
        if (this.muteBtn) {
            if (isMuted) {
                this.muteBtn.textContent = '🔇';
                this.muteBtn.classList.add('muted');
                this.muteBtn.title = 'Unmute Audio';
            } else {
                this.muteBtn.textContent = '🔊';
                this.muteBtn.classList.remove('muted');
                this.muteBtn.title = 'Mute Audio';
            }
        }
    }

    // Initialize mute button with current audio state
    initializeMuteButton(audioManager) {
        if (this.muteBtn && audioManager) {
            this.updateMuteButton(audioManager.isMutedState());
        }
    }

    // Event callbacks (to be set by Game class)
    onCharacterSelected = null;
    onActionClick = null;
    onStartBattle = null;
    onPlayAgain = null;
    onNewCharacters = null;
    onMuteToggle = null;
}
